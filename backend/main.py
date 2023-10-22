from flask import Flask, request, jsonify, make_response
from flask.json import provider
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
    address: str
    locality: str
    phone: str
    latitude: str
    longitude: str
    awaiting: int #liczba osób oczekujących
    average_period: int #średnia liczba dni oczekiwania
    date_situation_as_at: str
    date: str #data pierwszego wolnego terminu

    def __str__(self) -> str:
        return f"provider: {self.provider}, place: {self.place}, benefit: {self.benefit}, adress: {self.address}, locality: {self.locality}, phone: {self.phone}, latitude: {self.latitude}, longitude: {self.longitude}, awaiting: {self.awaiting}, average_period: {self.average_period}, date_situation_as_at: {self.date_situation_as_at}, date: {self.date}"

@dataclass
class Pages:
    count: int #liczba wyników
    current_page_number: int #numer aktualnej strony
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
    current_page_number = json_obj["meta"]["page"]

    links=json_obj["links"]
    pages = Pages(count, current_page_number, links["next"], links["prev"], links["self"], links["first"], links["last"])
    #json_formatted=json.dumps(json_obj, indent=4)
    data = json_obj["data"]
    for i in data:
        atrributes = i.get("attributes", None)
        if not atrributes:
            continue

        statistics = atrributes.get("statistics", None)
        dates = atrributes.get("dates", None)
        if not statistics or not dates:
            continue

        provider_data = statistics.get("provider-data", None)
        if not provider_data:
            continue

        objects.append(Kolejka(
            provider=atrributes.get("provider", None),
            place=atrributes.get("place", None),
            benefit=atrributes.get("benefit", None),
            address=atrributes.get("address", None),
            locality=atrributes.get("locality", None),
            phone=atrributes.get("phone", None),
            latitude=atrributes.get("latitude", None),
            longitude=atrributes.get("longitude", None),
            awaiting=provider_data["awaiting"],
            average_period=provider_data["average-period"],
            date_situation_as_at=dates["date-situation-as-at"],
            date=dates["date"]
        ))
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
    if "region" not in data or "query" not in data: #TODO:Remove
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
