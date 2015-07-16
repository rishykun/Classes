import fractions
import random

def perfect_power(n):
    """Get the integer and power that make up `n`.

    Args:
        n (int): The number to check.

    Returns:
        A tuple containing the values that correspond to the perfect powers of n
        or None if they do not exist. For example:

        (2, 3)

        corresponds to 2 ** 3 which equals 8, while:

        (None, None)

        corresponds to the case when `n` is not a perfect power.
    """
    i=2
    while True:
        s = int(pow(n, 1.0/i))
        if s**i == n:
            return (s,i)
        if (s+1)**i == n: #since int basically rounds down
            return (s+1,i)
        elif s==1:
            return (None, None)
        i+=1
        
def mpower(n,s,p):
    i = 1
    m = n
    if s == 1:
        return n%p
    else:
        while True:
            n = n**2 % p
            i *=2
            if i == s:
                return n
            if i*2 > s:
                break
        return (n%p)*(mpower(m,s-i,p)%p)%p

def sqrt(n, p):
    """Get the positive square root of n mod p if p is a prime and n is a
    quadratic residue mod n.

    There may be multiple square roots of n. For simplicity this function only
    returns only a positive one.

    Args:
        n (int): n is a quadratic residue (mod p).
        p (int): is an odd prime.

    Returns:
        The square root of n mod p.
    """

    return mpower(n,(p+1)/4, p)


def silvio(n):
    """Test primality of the number `n`.

    This function should return True with probablity 1.0 if `n` is prime and <=
    0.5 if `n` is composite.

    Args:
        n (int): A positive integer.

    Returns:
        Whether or not n is a prime number.
    """
    if n == 2:
        return True
    if n%2 == 0:
        return False
    if perfect_power(n)[0]:
        return False
    x = random.randrange(1,n)
    if fractions.gcd(x,n) != 1:
        return False
    y=sqrt(x**2 % n, n)
    if y != x %n and y != -x % n:
        return False
    return True
