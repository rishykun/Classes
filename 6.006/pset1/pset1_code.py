def dot(x,y):
    "dot product between two vectors -- code is fairly obvious to understand"
    s=0
    for i in range(len(x)):
        s+= x[i]*y[i]
    return s

def get_frequency_distribution(text):
    """Get the frequency distribution for the given `text`.

    The frequency distribution is defined as the number of occurrences of each
    letter in the range 'a' to 'z' converted to lowercase and normalized to have
    a Euclidean length of 1.

    Args:
        text (str): The input text for which the frequency distribution is
            desired.

    Returns:
        list: Frequency distribution of `text`.  The first value is the
            frequency for 'a', the next for 'b', and so on.

    """
    d={} #initialize dictionary to store frequencies
    L=[] #initialize answer
    l=0 #initialize normalization
    s='abcdefghijklmnopqrstuvwxyz'
    for x in s: #make keys of d the alphabet
        d[x] = 0
    for i in text: #frequencies of each letter incremented in d while traversing text
        i=i.lower()
        if i in s:
            d[i] = d[i] + 1
    for i in d.keys(): 
        l+= d[i]**2
    l=l**(0.5) #used for normalization
    for i in range(26):
        if l !=0:
            L+= [d[chr(i+97)]/float(l)] #add the normalized component to L
        else: #all entries are 0 i.e. no lettes in text
            L=[0]*26
    return L

def get_shift(ciphertext, natural_freq="shakespeare.txt"):
    """Get the shift of the `ciphertext` given a `natural_freq` file.

    The shift that converts plaintext into `ciphertext` is defined as the
    offset of the alphabet that maps plaintext into `ciphertext`.  For
    example, a shift of 3 maps 'a' to 'd', 'b' to 'e', and so on.

    Args:
        ciphertext (str): The encrypted text.

        natural_freq (str): Text file to be used for learning the "natural"
            frequency to base the shift off of.

    Returns:
        int: Alphabet shift between 0 and 25.

    """
    if natural_freq[-4:] ==".txt":
        f = open(natural_freq, 'r')
        nat_freq=f.read()
        f.close()
    else:
        nat_freq=natural_freq
    #loaded text into nat_freq, if nat_freq is not a file i.e. a string just use the string (will be useful for get_multi)
    x = get_frequency_distribution(ciphertext) #current state frequency dist
    nat = get_frequency_distribution(nat_freq) #natural frequency dist
    m = 1 - dot(nat, x) #initial distance
    k=0 #initial shift
    for i in range(1, 26):
        L = nat[26-i:26]+nat[:26-i] #shift frequency of nat as we shift the letters
        n = 1-dot(x, L) #new distance
        print "-------\ni: " + str(i-1)
        print "frequency distribution for shift:\n\t" + str(L)
        #print "frequency distribution for shift 2:\n\t" + str(x)
        print "natural distribution:\n\t" + str(nat) + "-------\n";
        print "current freqDistance: " + str(n);
        print "freqMinDistance: " + str(m);
        if n < m: #update current distance and shift if need be
            m=n
            k=i
    print "shift: " + str(k)
    return k

def get_multi_text(text, nciphers, cipherp):
    """Helper function which returns a string consisting of every cipherp'th character
    when dividing text using nciphers ciphers"""
    x='' #initialize string
    m=len(text)/nciphers #number of cipherps
    if m*nciphers+cipherp <= len(text): #adds one to m if cipherp <= remainder
        m = m + 1
    for i in range(m): #add every cipherp'th character
        x+= text[nciphers*i+cipherp-1]
    return x
        
        
def get_multi(ciphertext, k, natural_freq="shakespeare.txt"):
    """Get the `k` shifts of the `ciphertext` given an `natural_freq`.

    Checks every `k` characters for a different shift.  For example, if k = 3,
    the ciphertext has been shifted with 3 interleaving Ceasar ciphers such that
    every 3rd character has a different cipher.  Plaintext "aaaaaa" with k = 3
    might turn into "blfblf" meaning the 3 cipher shifts are (1, 11, 5).


    Args:
        ciphertext (str): The encrypted text.

        k (int): The number of Ceasar ciphers used.

        natural_freq (str): Text file to be used for learning the "natural"
            frequency to base the shifts off of.

    Returns:
        list: The shifts that correspond to each of the `k` ciphers used.

    """
    if natural_freq[-4:] ==".txt":
        f = open(natural_freq, 'r')
        nat_freq=f.read()
        f.close()
    else:
        nat_freq=natural_freq
    #loaded text into nat_freq, if nat_freq is not a file i.e. a string just use the string 
    L=[] #initialize answer
    for i in range(1, k+1): #i will be the ith cipher and ranges from 1 to k
        rawr1 = get_multi_text(ciphertext, k, i) #rawr1 containths the ith chars of ciphertext
        rawr2 = get_multi_text(nat_freq, k, i) #rawr2 contains the ith chars of nat_freq
        L+= [get_shift(rawr1, rawr2)] #adds the ith cipher shift to L
    return L
