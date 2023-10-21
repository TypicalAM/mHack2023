from flask import Flask, render_template, request, jsonify, make_response
import requests
import json
from dataclasses import dataclass
from http import HTTPStatus

app = Flask(__name__)
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

objects=[]

@app.route('/api', methods=['GET', 'POST'])
def index():
    errors=[]   
    benefit = request.args.get('benefit')
    provincy = request.args.get('provincy')
    locality = request.args.get('locality')

    
    objects.clear()
    try:
        url=f"https://api.nfz.gov.pl/app-itl-api/queues?page=1&limit=10&format=json&case=1&benefit={benefit}&provincy={provincy}&locality={locality}"
        r=requests.get(url)
        
    except:
        errors.append(
            "Unable to get URL. Please make sure it's valid and try again."
        )
    if r:
        json_obj=json.loads(r.text)
        pages=Pages(json_obj["meta"]["count"], json_obj["links"]["next"], json_obj["links"]["prev"], 
                    json_obj["links"]["self"], json_obj["links"]["first"], json_obj["links"]["last"])
        #json_formatted=json.dumps(json_obj, indent=4)
        json_cut=json_obj["data"]
        results=json_cut
        for i in results:
            objects.append(Kolejka(i["attributes"]["provider"], i["attributes"]["place"], i["attributes"]["benefit"], i["attributes"]["address"], 
                                    i["attributes"]["locality"], i["attributes"]["phone"], i["attributes"]["latitude"], i["attributes"]["longitude"], 
                                    i["attributes"]["statistics"]["provider-data"]["awaiting"], i["attributes"]["statistics"]["provider-data"]["average-period"], 
                                    i["attributes"]["dates"]["date-situation-as-at"], i["attributes"]["dates"]["date"]))
        
        print(len(results))

    #return render_template('index.html', errors=errors, objects=objects, pages=pages)
    return send_json(pages, objects)

@app.route('/api/json', methods=['GET'])
def send_json(pages, objects):
    print(jsonify(pages, objects))
    return jsonify(pages, objects)


def i_pretty_ask():
    data = request.get_json()
    print(data)
    return make_response(200, "gitgud")

if __name__ == '__main__':
    app.run(debug=True)