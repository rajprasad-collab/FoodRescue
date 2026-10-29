def extended_gcd(a, b):
    """Return (gcd, x, y) such that ax + by = gcd(a, b)."""
    if b == 0:
        return abs(a), 1 if a >= 0 else -1, 0

    gcd, x1, y1 = extended_gcd(b, a % b)
    x = y1
    y = x1 - (a // b) * y1
    return gcd, x, y


def mod_inverse(a, modulus):
    """Return the modular inverse of a modulo modulus."""
    gcd, x, _ = extended_gcd(a, modulus)
    if gcd != 1:
        raise ValueError("Modular inverse does not exist.")
    return x % modulus


def chinese_remainder_theorem(residues, moduli):
    """
    Solve:
        x ≡ residues[i] (mod moduli[i])

    Moduli must be pairwise coprime.

    Returns the smallest non-negative solution x and the product M.
    """
    if len(residues) != len(moduli) or not residues:
        raise ValueError("Residues and moduli must be non-empty and equal in length.")

    for i in range(len(moduli)):
        if moduli[i] <= 1:
            raise ValueError("Each modulus must be greater than 1.")
        for j in range(i + 1, len(moduli)):
            gcd, _, _ = extended_gcd(moduli[i], moduli[j])
            if gcd != 1:
                raise ValueError("Moduli must be pairwise coprime.")

    M = 1
    for modulus in moduli:
        M *= modulus

    x = 0
    for residue, modulus in zip(residues, moduli):
        Mi = M // modulus
        inverse = mod_inverse(Mi, modulus)
        x += residue * Mi * inverse

    return x % M, M
