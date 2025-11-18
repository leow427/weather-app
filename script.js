import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { fetchWeatherApi } from "openmeteo";

const app = express();
const port = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseParams = {
    latitude: 41.894689,
    longitude: -87.677832,
    minutely_15: ["temperature_2m", "relative_humidity_2m", "dew_point_2m"],
    hourly: ["precipitation_probability"],
    temperature_unit: "fahrenheit"
};

const url = "https://api.open-meteo.com/v1/forecast";

const buildWeatherData = response => {
    const utcOffsetSeconds = response.utcOffsetSeconds();
    const minutely15 = response.minutely15();
    const hourly = response.hourly();

    return {
        coordinates: {
            latitude: response.latitude(),
            longitude: response.longitude(),
            elevation: response.elevation(),
            utcOffsetSeconds
        },
        minutely15: {
            time: Array.from(
                {
                    length:
                        (Number(minutely15.timeEnd()) - Number(minutely15.time())) /
                        minutely15.interval()
                },
                (_, i) =>
                    new Date(
                        (Number(minutely15.time()) +
                            i * minutely15.interval() +
                            utcOffsetSeconds) *
                            1000
                    )
            ),
            temperature_2m: minutely15.variables(0).valuesArray(),
            relative_humidity_2m: minutely15.variables(1).valuesArray(),
            dew_point_2m: minutely15.variables(2).valuesArray()
        },
        hourly: {
            time: Array.from(
                {
                    length:
                        (Number(hourly.timeEnd()) - Number(hourly.time())) /
                        hourly.interval()
                },
                (_, i) =>
                    new Date(
                        (Number(hourly.time()) +
                            i * hourly.interval() +
                            utcOffsetSeconds) *
                            1000
                    )
            ),
            precipitation_probability: hourly.variables(0).valuesArray()
        }
    };
};

const fetchWeatherDataAsync = async overrides => {
    const requestParams = {
        ...baseParams,
        ...overrides,
        minutely_15: baseParams.minutely_15,
        hourly: baseParams.hourly,
        temperature_unit: baseParams.temperature_unit
    };
    const responses = await fetchWeatherApi(url, requestParams);

    if (!responses || responses.length === 0) {
        throw new Error("No responses from Open-Meteo");
    }

    return buildWeatherData(responses[0]);
};

const parseCoordinate = value => {
    if (value === undefined) {
        return null;
    }

    const parsed = Number.parseFloat(value);
    if (Number.isNaN(parsed)) {
        return null;
    }

    if (parsed < -90 || parsed > 90) {
        return null;
    }

    return parsed;
};

const parseLongitude = value => {
    if (value === undefined) {
        return null;
    }

    const parsed = Number.parseFloat(value);
    if (Number.isNaN(parsed)) {
        return null;
    }

    if (parsed < -180 || parsed > 180) {
        return null;
    }

    return parsed;
};

app.use(express.static(path.join(__dirname)));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/weather", async (req, res) => {
    try {
        const latitude = parseCoordinate(req.query.latitude);
        const longitude = parseLongitude(req.query.longitude);

        if (
            (req.query.latitude && latitude === null) ||
            (req.query.longitude && longitude === null)
        ) {
            return res
                .status(400)
                .json({ error: "Latitude must be between -90 and 90. Longitude between -180 and 180." });
        }

        const weatherData = await fetchWeatherDataAsync({
            latitude: latitude ?? baseParams.latitude,
            longitude: longitude ?? baseParams.longitude
        });
        res.json(weatherData);
    } catch (error) {
        console.error("Failed to fetch weather data", error);
        res.status(500).json({ error: "Failed to fetch weather data" });
    }
});

app.listen(port, () => {
    console.log(`Weather service listening on http://localhost:${port}`);
});
