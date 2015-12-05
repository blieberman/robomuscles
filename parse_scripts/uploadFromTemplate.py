#!/usr/bin/python

#This script is for uploading data from our template

import pymongo
import os
import json
import datetime
import ast
import cgi, os
import cgitb; cgitb.enable()

form = cgi.FieldStorage()

# Get filename here.
fileitem = form['file']

# Test if the file was uploaded
if fileitem.filename:
   # strip leading path from file name to avoid
   # directory traversal attacks
   fn = os.path.basename(fileitem.filename.replace("\\", "/" ))
   open('files/' + "test.txt", 'wb').write(fileitem.file.read())

   message = 'The file "' + fn + '" was uploaded successfully'

else:
   message = 'No file was uploaded'

print """\
Content-Type: text/html\n
<html>
<body>
   <p>%s</p>
</body>
</html>
""" % (message,)

#Loop through all data in the directory and make a json formatted output
def main():
    from pymongo import MongoClient
    client = MongoClient('mongodb://robodb01.blieberman.me/')
    db = client.data
    uploadJson('files/test.txt', db.temp)

#Loop through all data in the directory and make a json formatted output
#Return string of json
def uploadJson(file, collection):
    workFile = open(file)
    
    for line in workFile:
        line = line.split(' ')
        
        if (line[0] =='biomimic'):
            biomimic = line[2].rstrip()
        elif (line[0] == 'country'):
            country = line[2].rstrip()
        elif (line[0] == 'region'):
            region = line[2].rstrip()
        elif (line[0] == 'site'):
            site = line[2].rstrip()
        elif (line[0] == 'zone'):
            zone = line[2].rstrip()
        elif (line[0] == 'subzone'):
            sub_zone = line[2].rstrip()
        elif (line[0] == 'wave_exp'):
            wave_exp = line[2].rstrip()
        elif (line[0] == 'location'):
            location = line[2].rstrip()
        else:
            break
    result = collection.insert_one(
               {
                    "site": site,
                    "country": country,
                    "biomimic": biomimic,
                    "zone": zone,
                    "sub_zone": sub_zone,
                    "wave_exp": wave_exp,
                    "region": region,
                    "data": []
                }
            )
    
    
    pullData(workFile, collection, result.inserted_id)
    
    
   
#pull data from the given file
def pullData(workFile, collection, mongoID):
    workList = []
    
    for line in workFile:
        if (line[0] == 'T'):
            continue
        line = line.split('\t')
        temp = float(line[1].rstrip())
        date = toIsodate(line[0])
        workList.append({"Time":  date,
                "Temperature(C)": temp})
    
    #Push the data to the db
    collection.update(
        {"_id": mongoID},
        { "$push": {"data": 
            {"$each": workList}
        }}    
    )
   

#Format the given string as isodate
#Returns a string
def toIsodate(string):
    try:
        dateList = string.split('/')
        month = int(dateList[0])
        day = int(dateList[1])
        year = 2000 + (int(dateList[2][:dateList[2].find(' ')]) % 2000)   
        
    except:
        dateList = string.split('-')
        year = int(dateList[0])
        month = int(dateList[1])
        day = int(dateList[1])
        
    time = dateList[2][dateList[2].find(' '):]
    time = time.split(':')
    hours = int(time[0])
    minutes = int(time[1])
        
    return datetime.datetime(year, month, day, hours, minutes).isoformat()


main()
