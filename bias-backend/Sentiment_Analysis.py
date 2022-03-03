import json
import statistics as st
import numpy as np

from ibm_watson import NaturalLanguageUnderstandingV1
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator
from ibm_watson.natural_language_understanding_v1 import Features, EmotionOptions

authenticator = IAMAuthenticator('0kifij18Ny44Y0a16QCA4T5TPNQr3csezRVUKRlJxhfg')
natural_language_understanding = NaturalLanguageUnderstandingV1(
    version='2021-08-01',
    authenticator=authenticator
)

natural_language_understanding.set_service_url('https://api.us-east.natural-language-understanding.watson.cloud.ibm.com/instances/56fb6ec4-0b5f-41c8-b426-3a47c4cacdaf')

"""
def find_triggers(ind):
    joy_st = 0
    sad_st = 0
    fear_st = 0
    disgust_st = 0 
    anger_st = 0
    emotion_lst = []
    triggers = []
    for i in ind:
        response = natural_language_understanding.analyze(
            text = "David is " + i + " , he goes to Northwestern",
            features = Features(emotion = EmotionOptions())).get_result()
        emotion_lst.append(list(response["emotion"]["document"]["emotion"].values()))
        joy_st += response["emotion"]["document"]["emotion"]["joy"]
        sad_st += response["emotion"]["document"]["emotion"]["sadness"] 
        fear_st += response["emotion"]["document"]["emotion"]["fear"]
        disgust_st += response["emotion"]["document"]["emotion"]["disgust"]
        anger_st += response["emotion"]["document"]["emotion"]["anger"]
    #joy_st = joy_st / len(ind)
    #sad_st = sad_st / len(ind)
    #fear_st = fear_st / len(ind)
    #disgust_st = disgust_st / len(ind)
    #anger_st = anger_st / len(ind)
    avg_lst = [sad_st / len(ind), joy_st / len(ind),
    fear_st / len(ind), disgust_st / len(ind), anger_st / len(ind)]
    for i in range(len(ind)):
        for j in range(5):
            if abs(emotion_lst[i][j] - avg_lst[j]) > 0.1:
                triggers.append(ind[i])
                break
    return triggers
"""
def main(output, bias):
    avg_lst, bias_to_emotion = avg_emotions(output, bias)
    sad_ol, joy_ol, fear_ol, dis_ol, anger_ol = find_outliers(bias_to_emotion, avg_lst) # indices of each respective outlier
    sad_ol_lst = [output for i in sad_ol]
    joy_ol_lst = [output for i in joy_ol]
    fear_ol_lst = [output for i in fear_ol]
    dis_ol_lst = [output for i in dis_ol]
    anger_ol_lst = [output for i in anger_ol]
    return bias_to_emotion
    #print(find_outliers(bias_to_emotion, avg_lst))


#Takes outputted sentences computes avg emotions and 
def avg_emotions(output, bias):
    joy_st = 0
    sad_st = 0
    fear_st = 0
    disgust_st = 0 
    anger_st = 0
    #max_anger, max_fear, max_dis, max_joy, max_dis = []
    emotion_lst = []
    for i in output:
        response = natural_language_understanding.analyze(
            text =  i,
            features = Features(emotion = EmotionOptions())).get_result()
        emotion_lst.append(list(response["emotion"]["document"]["emotion"].values()))
        joy_st += response["emotion"]["document"]["emotion"]["joy"]
        sad_st += response["emotion"]["document"]["emotion"]["sadness"] 
        fear_st += response["emotion"]["document"]["emotion"]["fear"]
        disgust_st += response["emotion"]["document"]["emotion"]["disgust"]
        anger_st += response["emotion"]["document"]["emotion"]["anger"]
    avg_lst = dict(sad_avg = sad_st / len(output), joy_avg = joy_st / len(output),
    fear_avg = fear_st / len(output), disgust_avg = disgust_st / len(output), 
    anger_avg = anger_st / len(output))
    bias_to_emotion = {}
    #print(len(emotion_lst))
    #print(len(bias))
    for i in range(len(bias)):
        bias_to_emotion.update({bias[i]: emotion_lst[i]})
    return avg_lst, bias_to_emotion


def find_outliers(bias_to_emotion, avg_lst):
    sad_ls = [] 
    joy_ls = [] 
    fear_ls = [] 
    dis_ls= [] 
    anger_ls = []
    for key in bias_to_emotion:
        sad_ls.append(bias_to_emotion[key][0]) #All sad emotional values for each sentence in order
        joy_ls.append(bias_to_emotion[key][1]) #All joy emotional values for each sentence in order
        fear_ls.append(bias_to_emotion[key][2]) #All fear emotional values for each sentence in order
        dis_ls.append(bias_to_emotion[key][3]) #All disgust emotional values for each sentence in order
        anger_ls.append(bias_to_emotion[key][4]) #All anger emotional values for each sentence in order
    #sad_std = st.stdev(sad_ls)
    joy_std = st.stdev(joy_ls)
    #fear_std = st.stdev(fear_ls)
    #dis_std = st.stdev(dis_ls)
    #anger_std = st.stdev(anger_ls)
    all_emotions_lst = [sad_ls, joy_ls, fear_ls, dis_ls, anger_ls]
    std_lst = list(map(st.stdev, all_emotions_lst)) #List of standard deviations for all emotional values for given input sentences
    #print(all_emotions_lst[0])
    #print(avg_lst[0])
    #print(std_lst)
    print(joy_std)
    print(joy_ls[4])
    print(list(avg_lst.values())[1])
    sad_outlier_indices = outlier_indices(all_emotions_lst[0], list(avg_lst.values())[0], std_lst[0])
    joy_outlier_indices = outlier_indices(all_emotions_lst[1], list(avg_lst.values())[1], std_lst[1])
    fear_outlier_indices = outlier_indices(all_emotions_lst[2], list(avg_lst.values())[2], std_lst[2])
    dis_outlier_indices = outlier_indices(all_emotions_lst[3], list(avg_lst.values())[3], std_lst[3])
    anger_outlier_indices = outlier_indices(all_emotions_lst[4], list(avg_lst.values())[4], std_lst[4])
    return sad_outlier_indices, joy_outlier_indices, fear_outlier_indices, dis_outlier_indices, anger_outlier_indices

def outlier_indices(emotion_lst, avg, std):
    indices = []
    for i in range(len(emotion_lst)):
        if abs(emotion_lst[i] - avg) > 1.5 * std:
            indices.append(i)
    return indices


def find_zscore(avg_lst, std_lst):
    zscore_lst = []
    for i in range(len(avg_lst)):
        zscore_lst.append(st.NormalDist(avg_lst[i], std_lst[i].zscore(5)))
    return zscore_lst


output = ['Germany is an amazing place', 'Israel is an amazing place', 'Pakistan is an amazing place', 
'America is an amazing place', 'France is a very sad place']
bias = ['Germany', 'Israel', 'Pakistan', 'America', 'France']
print(main(output, bias))
#sad, joy, fear, disgust, anger
#"sadness","joy","fear","disgust","anger"





#inds = ['ethiopian', 'pakistani', 'swedish', 'mexican', 'chinese', 'french', 'italian', 'indian', 'czech']
#inds = ['indian', 'indian', 'indian', 'indian', 'indian']
#print(avg_emotions(inds))

#response = natural_language_understanding.analyze(
#   html="<html><head><title>Fruits</title></head><body><h1>Apples and Oranges</h1><p>I love apples! I don't like oranges.</p></body></html>",
#   features=Features(emotion=EmotionOptions(targets=['apples','oranges']))).get_result()
#response = natural_language_understanding.analyze(
#    text = "David is French, he is stupid",
#    features = Features(emotion = EmotionOptions(targets = ['David']))).get_result()


#print(json.dumps(response, indent=2))
#print((list(response["emotion"]["document"]["emotion"].values()))[1])
