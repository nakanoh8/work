def main():
    jusshinsu = 10
    while 0 < jusshinsu:
        if isKaibunsu(jusshinsu) and isKaibunsu(toNishinsu(jusshinsu)) and isKaibunsu(toHachishinsu(jusshinsu)):
            print(jusshinsu)
            return
        print(jusshinsu)
        jusshinsu += 1

# [0,1]のみ使用した数を順に取得することで2進数を算出
def toNishinsu(jusshinsu):
    nishinsu = 0
    nishinsuCounter = -1
    i = -1
    while nishinsuCounter < jusshinsu:
        i += 1
        if isNishinsu(i):
            nishinsuCounter += 1
            nishinsu = i
    return nishinsu

def isNishinsu(num):
    for aChar in list(str(num)):
        if int(aChar) >= 2:
            return False
    return True

# [0~7]のみ使用した数を順に取得することで8進数を算出
def toHachishinsu(jusshinsu):
    hachishinsu = 0
    hachishinsuCounter = -1
    i = -1
    while hachishinsuCounter < jusshinsu:
        i += 1
        if isHachishinsu(i):
            hachishinsuCounter += 1
            hachishinsu = i
    return hachishinsu

def isHachishinsu(num):
    for aChar in list(str(num)):
        if int(aChar) >= 8:
            return False
    return True

def isKaibunsu(num):
    return str(num) == ''.join(list(reversed(str(num))))

main()