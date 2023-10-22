from flask import Flask, request, jsonify, make_response
from flask_cors import CORS, cross_origin
import requests
import json
from dataclasses import dataclass
from http import HTTPStatus
import csv

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
@dataclass
class Kolejka:
    provider: str
    place: str
    benefit: str
    adress: str
    locality: str
    phone: str
    latitude: str
    longitude: str
    awaiting: int #liczba osób oczekujących
    average_period: int #średnia liczba dni oczekiwania
    date_situation_as_at: str
    date: str #data pierwszego wolnego terminu

    def __str__(self) -> str:
        return f"provider: {self.provider}, place: {self.place}, benefit: {self.benefit}, adress: {self.adress}, locality: {self.locality}, phone: {self.phone}, latitude: {self.latitude}, longitude: {self.longitude}, awaiting: {self.awaiting}, average_period: {self.average_period}, date_situation_as_at: {self.date_situation_as_at}, date: {self.date}"

@dataclass
class Pages:
    count: int #liczba wyników
    #strony z wynikami
    next: str
    previous: str
    current: str
    first: str
    last: str

@dataclass
class Output:
    objects: list[Kolejka]
    pages: Pages

@dataclass
class Input:
    benefit: str
    province: str
    locality: str
    page: int

@dataclass
class InputBenefit:
    benefit_letters: str

objects=[]

@app.route('/api', methods=['POST'])
@cross_origin()
def index():
    data = request.get_json()
    if not data:
        return make_response("No data provided", HTTPStatus.BAD_REQUEST)

    try:
        input_data = Input(**data) 
    except TypeError as e:
        return make_response(f"Invalid data provided: {e}", HTTPStatus.BAD_REQUEST)

    objects.clear()
    try:
        url=f"https://api.nfz.gov.pl/app-itl-api/queues?page={input_data.page}&limit=5&format=json&case=1&benefit={input_data.benefit}&provincy={input_data.province}&locality={input_data.locality}"
        r=requests.get(url)
    except:
        return make_response("Unable to get URL. Please make sure it's valid and try again.", HTTPStatus.BAD_REQUEST)

    if not r:
        return make_response("Unable to get URL. Please make sure it's valid and try again.", HTTPStatus.BAD_REQUEST)

    json_obj=json.loads(r.text)
    count = json_obj["meta"]["count"]
    if not count:
        return make_response("No results found. Please make sure it's valid and try again.", HTTPStatus.NOT_FOUND)

    links=json_obj["links"]
    pages = Pages(count, links["next"], links["prev"], links["self"], links["first"], links["last"])
    #json_formatted=json.dumps(json_obj, indent=4)
    data = json_obj["data"]
    for i in data:
       objects.append(Kolejka(i["attributes"]["provider"], i["attributes"]["place"], i["attributes"]["benefit"], i["attributes"]["address"], i["attributes"]["locality"], i["attributes"]["phone"], i["attributes"]["latitude"], i["attributes"]["longitude"], i["attributes"]["statistics"]["provider-data"]["awaiting"], i["attributes"]["statistics"]["provider-data"]["average-period"],i["attributes"]["dates"]["date-situation-as-at"], i["attributes"]["dates"]["date"]))
    #return render_template('index.html', errors=errors, objects=objects, pages=pages)
    return send_json(pages, objects)


def send_json(pages, objects):
    result = Output(objects, pages)
    response = make_response(jsonify(result), HTTPStatus.OK)
    response.headers['Content-Type'] = 'application/json'
    return response

@app.route('/api/cities', methods=['POST'])
@cross_origin()
def cities():
    import os
    json_dir = os.path.join("backend", "data")
    files = os.listdir(json_dir)
    data = request.get_json()
    print(data)
    print(data["region"]+".json")
    if "region" not in data or "query" not in data:
        print("jeden")
        print(files)
        return make_response("No data provided", HTTPStatus.BAD_REQUEST)

    if data["region"]+".json" not in files:
        print("dwa")
        return make_response("Bad data provided", HTTPStatus.BAD_REQUEST)

    json_obj = {}
    try:
        path = os.path.join(json_dir, data["region"]+'.json')
        with open(path, newline='') as f:
            json_obj = json.load(f)
    except Exception as e:
        
        print("trzy", e)
        return make_response("Bad data provided", HTTPStatus.BAD_REQUEST)

    print(json_obj)
    return make_response(jsonify(tuple(json_obj.items())[0][1]), HTTPStatus.OK)

@app.route('/api/benefits', methods=['POST'])
@cross_origin()
def benefits():
    data = request.get_json()
    benefits = []
    benefits.clear()
    try:
        input_data = InputBenefit(**data)
    except TypeError as e:
        return make_response(f"Invalid data provided: {e}", HTTPStatus.BAD_REQUEST)
    try:
        url=f"https://api.nfz.gov.pl/app-itl-api/queues?page=1&limit=15&format=json&case=1&benefit={input_data.benefit_letters}"
        r=requests.get(url)
    except:
        return make_response("Unable to get URL. Please make sure it's valid and try again.", HTTPStatus.BAD_REQUEST)
    
    if not r:
        return make_response("Unable to get URL. Please make sure it's valid and try again.", HTTPStatus.BAD_REQUEST)
    
    json_obj=json.loads(r.text)
    data = json_obj["data"]
    for i in data:
        if i["attributes"]["benefit"] not in benefits:
            benefits.append(i["attributes"]["benefit"])   

    return benefits


if __name__ == '__main__':
    app.run(debug=True)
