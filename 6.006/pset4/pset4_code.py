class rollhash:
    def __init__(self, p):
        self.value = 0
        self.mod = p
        self.length = 0
        self.powmemo = {}
        
    def hashf(self):
        return self.value % self.mod
    
    def append(self,c):
        self.value = ((self.value % self.mod)*26 + ord(c)-ord('A')) % self.mod
        self.length += 1

    def skip(self, c):
        if self.length - 1 in self.powmemo:
            x = self.powmemo[self.length - 1]
        else:
            x = pow(26, self.length - 1, self.mod)
            self.powmemo[self.length - 1] = pow(26, self.length - 1, self.mod)
        self.value = ((self.value % self.mod) - (ord(c)-ord('A'))* x) % self.mod
        self.length -= 1

def hashdict(s, sublength, p):
    d = {}
    r = rollhash(p)
    i = 0
    while i <= sublength - 1:
        r.append(s[i])
        i += 1
    d[r.hashf()] = [s[:sublength]]
    while i <= len(s) - 1:
        r.skip(s[i-sublength])
        r.append(s[i])
        if r.hashf() not in d:
            d[r.hashf()] = [s[i-sublength+1:i+1]]
        else:
            d[r.hashf()].append(s[i-sublength+1:i+1])
        i += 1
    return d

def dna_match(navi_dna, human_dna):
    """Get nucleotide sequence that exists in both the `navi_dna` and the
    `human_dna` with maxiumum length.

    Finds the nucleotide sequence, s, with maximum length, such that s exists in
    both the Na'vi and human DNA.

    Args:
        navi_dna (str): DNA sequence from a Na'vi.
        human_dna (str): DNA sequence of a human.

    Returns:
        The nucleotide sequence that exists in both the `navi_dna` and
        the `human_dna` that has maxiumum length.
    """
    if navi_dna == '' or human_dna == '':
        return ''
    low = 0
    high = len(navi_dna)
    guess = (high+low)/2
    answer = ''
    answer 
    flag = False
    while True:
        currentstring = ''
        d = hashdict(navi_dna, guess, 100003)
        r=rollhash(100003)
        i = 0
        if guess > len(human_dna):
            high = guess
            guess = (high+low)/2
        else:
            while i <= guess - 1:
                r.append(human_dna[i])
                currentstring += human_dna[i]
                i += 1
            if (r.hashf() in d) and (currentstring in d[r.hashf()]):
                answer = currentstring
                low = guess
                guess = (high+low)/2
            else:
                while i <= len(human_dna) - 1:
                    r.skip(human_dna[i-guess])
                    currentstring = currentstring[1:]
                    r.append(human_dna[i])
                    currentstring += human_dna[i]
                    if r.hashf() in d:
                        if currentstring in d[r.hashf()]:
                            answer = currentstring
                            low = guess
                            guess = (high+low)/2
                            break
                    i += 1
                    if i == len(human_dna):
                        high = guess
                        guess = (high+low)/2
        if flag:
            return answer
        if guess == low:
            guess = high
            flag = True
            
                
            
