def main():
    jusshinsu = 10
    while 0 < jusshinsu:
        if isKaibunsu(jusshinsu) and isKaibunsu(toNishinsu(jusshinsu)) and isKaibunsu(toHachishinsu(jusshinsu)):
            print('>> Answer:', str(jusshinsu))
            return
        print(jusshinsu)
        jusshinsu += 1

# n%2 の結果から2進数を算出
def toNishinsu(jusshinsu):
    nishinsuList = []
    divisionResult = jusshinsu
    while divisionResult != 0:
        nishinsuList.insert(0, str(divisionResult%2))
        divisionResult = divisionResult//2
    return int(''.join(nishinsuList))

# n%8 の結果から8進数を算出
def toHachishinsu(jusshinsu):
    hachishinsuList = []
    divisionResult = jusshinsu
    while divisionResult != 0:
        hachishinsuList.insert(0, str(divisionResult%8))
        divisionResult = divisionResult//8
    return int(''.join(hachishinsuList))

def isKaibunsu(num):
    return str(num) == ''.join(list(reversed(str(num))))

main()