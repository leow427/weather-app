
''' 
all pseudo code

from flask import Flask, request, jsonify
import serial
import time


app = Flask(__name__)


@app.route('/process_data', methods=['POST'])

def process_data():
    data = request.get_json()
    js_variable = data.get('temp')
    # process the variable in python
    result = f'Python received: {js_variale}'
    return jsonify({'message': result})


if __name__ == '__main__':
    app.run(debug-True)


# fill this in once you get arduino to test
# ser = ser.Serial('')
#

time.sleep(2) 


try:
    while True:
        data_to_send = {temperature_reading_from_API}
        ser.write(data_to_send.encode())
        print(f'Sent: {data_to_send}')
        time.sleep(5)

except interrupt:
    ser.close()
    print('Serial connection closed)



'''