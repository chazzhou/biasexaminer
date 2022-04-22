from collections import Counter
#import collections
def solution(S):
    vowels = set("aeiouy")
    letters = Counter(l for l in S.lower() if l in vowels)
    output = letters.most_common()
    final_lst = max_values(output) #Helper function used to find max vowels
    s = ""
    count = 0
    #Formatting for return value
    for i in final_lst:
        if len(final_lst) == 1 or count == len(final_lst) - 1:
            s = (s + str(i[0]) + " appears " + str(i[1]) + " time(s)")
        else:
            s = s = (s + str(i[0]) + " appears " + str(i[1]) + " time(s)" + "\n")
        count = count + 1
    return s

def max_values(output):
    m = 0
    for i in output:
        if i[1] > m:
            m = i[1]
    final_lst = []
    for i in output:
        if i[1] == m:
            final_lst.append(i)
    #final_lst.reverse()
    final_lst.sort(key = lambda y: y[0])
    return final_lst








print(solution('The quick brown fox jumps over the lazy dog'))
