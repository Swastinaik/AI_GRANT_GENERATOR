import random
import string

def generate_alphabet_string(length):
    """
    Generates a random string containing only alphabetic characters (A-Z, a-z).

    Args:
        length (int): The desired length of the random string.

    Returns:
        str: A random string composed solely of alphabetic characters.
    """
    alphabets = string.ascii_letters
    return ''.join(random.choice(alphabets) for _ in range(length))