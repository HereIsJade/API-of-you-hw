import csv, os
import json
import sys
# from textblob import TextBlob

path=r"hate crime index data/"


keywordsList=[];
jsonKW=[];



with open(path+'Jun.csv') as fin:
    csvin = csv.reader(fin)
    header = next(csvin, [])
    json.dump(dict(zip(header, zip(*csvin))),open("Jun.json","w"),indent=4)

jsonfile=open("Jun.json","r")


with jsonfile as data_file:
    data = json.load(data_file)

    for i in range(len(data["Keywords"])):

        if(data["Keywords"][i]==""):
            # keywords=re.split('; |, |\*|\n',data["Article Title"][i].lower())
            keywords=data["Article Title"][i].lower().split()

            wordsPerLine=[]
            #if Keywords in csv have the same ones, reduce redundancy
            for word in keywords:
                if word not in wordsPerLine:
                    wordsPerLine.append(word)
                    if word not in keywordsList:
                        keywordsList.append(word)
                        newWord={}
                        newWord["word"]=word
                        newWord["titles"]=[]
                        newWord["titles"].append(data["Article Title"][i])
                        newWord["urls"]=[]
                        newWord["urls"].append(data["URL"][i])
                        newWord["dates"]=[]
                        newWord["dates"].append(data["Article Date"][i])
                        jsonKW.append(newWord)
                    else:
                        wordIndex=keywordsList.index(word)
                        jsonKW[wordIndex]["titles"].append(data["Article Title"][i])
                        jsonKW[wordIndex]["urls"].append(data["URL"][i])
                        jsonKW[wordIndex]["dates"].append(data["Article Date"][i])
                else:
                    continue
        else:
            keywords=data["Keywords"][i].split()
            #if Keywords in csv have the same ones, reduce redundancy
            wordsPerLine=[]
            for word in keywords:
                if word not in wordsPerLine:
                    wordsPerLine.append(word)
                    if word not in keywordsList:
                        keywordsList.append(word)
                        newWord={}
                        newWord["word"]=word
                        newWord["titles"]=[]
                        newWord["titles"].append(data["Article Title"][i])
                        newWord["urls"]=[]
                        newWord["urls"].append(data["URL"][i])
                        newWord["dates"]=[]
                        newWord["dates"].append(data["Article Date"][i])
                        jsonKW.append(newWord)
                    else:
                        wordIndex=keywordsList.index(word)
                        jsonKW[wordIndex]["titles"].append(data["Article Title"][i])
                        jsonKW[wordIndex]["urls"].append(data["URL"][i])
                        jsonKW[wordIndex]["dates"].append(data["Article Date"][i])
                else:
                    continue

#remove the word from the cloud if frequency is too low
newJson=[]
newJson = [x for x in jsonKW if len(x["dates"])>=5 ]
# or x["word"]!="crime" or x["word"]!="crimes"
newJson = [x for x in newJson if (x["word"]!="hate")]
newJson = [x for x in newJson if (x["word"]!="crime")]
newJson = [x for x in newJson if (x["word"]!="crimes")]
for element in newJson:
    element["count"]=len(element["dates"])

print len(newJson)


with open('JunKW.json', 'w') as fout:
    json.dump(newJson, fout,indent=4)
