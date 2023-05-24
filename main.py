from flask import Flask, render_template, jsonify
import requests
import random
import glob
app = Flask(__name__)


def read_temperature():
    sensor_data_path = '/sys/bus/w1/devices/28*/w1_slave'
    sensor_files = glob.glob(sensor_data_path)
    
    if not sensor_files:
        return None
    
    sensor_file = sensor_files[0]
    with open(sensor_file, 'r') as file:
        lines = file.readlines()
        
        if lines[0].strip().endswith('YES'):
            temperature_line = lines[1]
            temperature_start = temperature_line.find('t=') + 2
            temperature_string = temperature_line[temperature_start:].strip()
            temperature = float(temperature_string) / 1000.0
            
            return temperature
    
    return None

def get_temperature_data():
    #temperature = read_temperature()        if you're using the rasberry pi card if not use random values
    temperature = random.uniform(0,30)
    apitemperature = get_temperature_from_api()
    return {'temperature': temperature, 'apitemperature': apitemperature}

def get_temperature_from_api():
    #api_key = add your weatherapi key here
    url = f'http://api.weatherapi.com/v1/current.json?key={api_key}&q=Rabat'
    response = requests.get(url)
    data = response.json()
    
    if 'current' in data:
        apitemperature = data['current']['temp_c']
        return apitemperature
    
    return None



@app.route('/')
def index():
    return render_template('index.html')
@app.route('/chart')
def chart():
    return render_template('chart.html')


@app.route('/temperature', methods=['GET'])
def get_temperature():
    #temperature = read_temperature()
    temperature = random.uniform(0, 30)
    apitemperature = get_temperature_from_api()
    
    if temperature is not None:
        return jsonify({'temperature': temperature, 'apitemperature': apitemperature})
    else:
        return jsonify({'error': 'Failed to read temperature data'}), 500

if __name__ == '__main__':
    app.run(debug=True)
