countriesStr = "Brazil,Cameroon,Chile,Greece,Uruguay,Italy,France,Bosnia and Herzegovina,Germany,USA,Russia,Croatia,Spain,Australia,Cote d'lvoire,Costa Rica,Switzerland,Honduras,Iran,Portugal,Belgium,Korea Republic,Mexico,Netherlands,Colombia,Japan,England,Ecuador,Argentina,Nigeria,Ghana,Algeria"
countriesUpper = countriesStr.upper().split(",")
usedCountries = []
# print(countriesUpper)

def main():
    for c in countriesUpper:
        print(nextCountriesFor(c))
            



    

# def main():
#     shiritoriCountriesSet = []
#     for startCountry in countriesUpper:
#         for c in nextCountriesFor(startCountry):
#             for c2 in nextCountriesFor(c):

#     return maxShiritoriCountries(shiritoriCountriesSet)

# def shiritoriCountries(c):
#     if len(nextCountriesFor(c)) == 0:
#         shiritoriCountriesSet.append()
#         return
#     for nc in nextCountriesFor(c):

#     return shiritoriCountries(c)
    
#     myfunc(x)

def shiritoriCountries(sc):
    for nc in nextCountriesFor(sc[-1]):
        sc.append(nc)
    return shiritoriCountries(shiritoriCountries().append(c))
        
def maxShiritoriCountries(shiritoriCountriesSet):
    result = []
    for countries in shiritoriCountriesSet:
        if len(result) < len(countries):
            result = countries
    return result


def nextCountriesFor(aheadCountry):
    result = []
    for country in countriesUpper:
        if country in usedCountries:
            continue
        if aheadCountry[-1] == country[0]:
            result.append(country)
            usedCountries.append(country)
    return result

main()