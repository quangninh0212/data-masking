package com.nhom.backend.util;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Arrays;

public class AesCore {

    private AesCore() {
    }

    private static final int[] SBOX = {
            0x63,0x7c,0x77,0x7b,0xf2,0x6b,0x6f,0xc5,0x30,0x01,0x67,0x2b,0xfe,0xd7,0xab,0x76,
            0xca,0x82,0xc9,0x7d,0xfa,0x59,0x47,0xf0,0xad,0xd4,0xa2,0xaf,0x9c,0xa4,0x72,0xc0,
            0xb7,0xfd,0x93,0x26,0x36,0x3f,0xf7,0xcc,0x34,0xa5,0xe5,0xf1,0x71,0xd8,0x31,0x15,
            0x04,0xc7,0x23,0xc3,0x18,0x96,0x05,0x9a,0x07,0x12,0x80,0xe2,0xeb,0x27,0xb2,0x75,
            0x09,0x83,0x2c,0x1a,0x1b,0x6e,0x5a,0xa0,0x52,0x3b,0xd6,0xb3,0x29,0xe3,0x2f,0x84,
            0x53,0xd1,0x00,0xed,0x20,0xfc,0xb1,0x5b,0x6a,0xcb,0xbe,0x39,0x4a,0x4c,0x58,0xcf,
            0xd0,0xef,0xaa,0xfb,0x43,0x4d,0x33,0x85,0x45,0xf9,0x02,0x7f,0x50,0x3c,0x9f,0xa8,
            0x51,0xa3,0x40,0x8f,0x92,0x9d,0x38,0xf5,0xbc,0xb6,0xda,0x21,0x10,0xff,0xf3,0xd2,
            0xcd,0x0c,0x13,0xec,0x5f,0x97,0x44,0x17,0xc4,0xa7,0x7e,0x3d,0x64,0x5d,0x19,0x73,
            0x60,0x81,0x4f,0xdc,0x22,0x2a,0x90,0x88,0x46,0xee,0xb8,0x14,0xde,0x5e,0x0b,0xdb,
            0xe0,0x32,0x3a,0x0a,0x49,0x06,0x24,0x5c,0xc2,0xd3,0xac,0x62,0x91,0x95,0xe4,0x79,
            0xe7,0xc8,0x37,0x6d,0x8d,0xd5,0x4e,0xa9,0x6c,0x56,0xf4,0xea,0x65,0x7a,0xae,0x08,
            0xba,0x78,0x25,0x2e,0x1c,0xa6,0xb4,0xc6,0xe8,0xdd,0x74,0x1f,0x4b,0xbd,0x8b,0x8a,
            0x70,0x3e,0xb5,0x66,0x48,0x03,0xf6,0x0e,0x61,0x35,0x57,0xb9,0x86,0xc1,0x1d,0x9e,
            0xe1,0xf8,0x98,0x11,0x69,0xd9,0x8e,0x94,0x9b,0x1e,0x87,0xe9,0xce,0x55,0x28,0xdf,
            0x8c,0xa1,0x89,0x0d,0xbf,0xe6,0x42,0x68,0x41,0x99,0x2d,0x0f,0xb0,0x54,0xbb,0x16
    };

    private static final int[] INV_SBOX = {
            0x52,0x09,0x6a,0xd5,0x30,0x36,0xa5,0x38,0xbf,0x40,0xa3,0x9e,0x81,0xf3,0xd7,0xfb,
            0x7c,0xe3,0x39,0x82,0x9b,0x2f,0xff,0x87,0x34,0x8e,0x43,0x44,0xc4,0xde,0xe9,0xcb,
            0x54,0x7b,0x94,0x32,0xa6,0xc2,0x23,0x3d,0xee,0x4c,0x95,0x0b,0x42,0xfa,0xc3,0x4e,
            0x08,0x2e,0xa1,0x66,0x28,0xd9,0x24,0xb2,0x76,0x5b,0xa2,0x49,0x6d,0x8b,0xd1,0x25,
            0x72,0xf8,0xf6,0x64,0x86,0x68,0x98,0x16,0xd4,0xa4,0x5c,0xcc,0x5d,0x65,0xb6,0x92,
            0x6c,0x70,0x48,0x50,0xfd,0xed,0xb9,0xda,0x5e,0x15,0x46,0x57,0xa7,0x8d,0x9d,0x84,
            0x90,0xd8,0xab,0x00,0x8c,0xbc,0xd3,0x0a,0xf7,0xe4,0x58,0x05,0xb8,0xb3,0x45,0x06,
            0xd0,0x2c,0x1e,0x8f,0xca,0x3f,0x0f,0x02,0xc1,0xaf,0xbd,0x03,0x01,0x13,0x8a,0x6b,
            0x3a,0x91,0x11,0x41,0x4f,0x67,0xdc,0xea,0x97,0xf2,0xcf,0xce,0xf0,0xb4,0xe6,0x73,
            0x96,0xac,0x74,0x22,0xe7,0xad,0x35,0x85,0xe2,0xf9,0x37,0xe8,0x1c,0x75,0xdf,0x6e,
            0x47,0xf1,0x1a,0x71,0x1d,0x29,0xc5,0x89,0x6f,0xb7,0x62,0x0e,0xaa,0x18,0xbe,0x1b,
            0xfc,0x56,0x3e,0x4b,0xc6,0xd2,0x79,0x20,0x9a,0xdb,0xc0,0xfe,0x78,0xcd,0x5a,0xf4,
            0x1f,0xdd,0xa8,0x33,0x88,0x07,0xc7,0x31,0xb1,0x12,0x10,0x59,0x27,0x80,0xec,0x5f,
            0x60,0x51,0x7f,0xa9,0x19,0xb5,0x4a,0x0d,0x2d,0xe5,0x7a,0x9f,0x93,0xc9,0x9c,0xef,
            0xa0,0xe0,0x3b,0x4d,0xae,0x2a,0xf5,0xb0,0xc8,0xeb,0xbb,0x3c,0x83,0x53,0x99,0x61,
            0x17,0x2b,0x04,0x7e,0xba,0x77,0xd6,0x26,0xe1,0x69,0x14,0x63,0x55,0x21,0x0c,0x7d
    };

    private static final int[] RCON = {0x01,0x02,0x04,0x08,0x10,0x20,0x40,0x80,0x1b,0x36};

    private static int gfMult(int a, int b) {
        int p = 0;
        for (int i = 0; i < 8; i++) {
            if ((b & 1) != 0) {
                p ^= a;
            }
            boolean hiBitSet = (a & 0x80) != 0;
            a <<= 1;
            if (hiBitSet) {
                a ^= 0x1b;
            }
            a &= 0xff;
            b >>= 1;
        }
        return p & 0xff;
    }

    private static int[] subBytes(int[] state) {
        int[] result = new int[16];
        for (int i = 0; i < 16; i++) result[i] = SBOX[state[i]];
        return result;
    }

    private static int[] invSubBytes(int[] state) {
        int[] result = new int[16];
        for (int i = 0; i < 16; i++) result[i] = INV_SBOX[state[i]];
        return result;
    }

    private static int[] shiftRows(int[] state) {
        return new int[]{
                state[0], state[5], state[10], state[15],
                state[4], state[9], state[14], state[3],
                state[8], state[13], state[2], state[7],
                state[12], state[1], state[6], state[11]
        };
    }

    private static int[] invShiftRows(int[] state) {
        return new int[]{
                state[0], state[13], state[10], state[7],
                state[4], state[1], state[14], state[11],
                state[8], state[5], state[2], state[15],
                state[12], state[9], state[6], state[3]
        };
    }

    private static int[] mixColumns(int[] state) {
        int[] result = new int[16];
        for (int c = 0; c < 4; c++) {
            result[c]      = gfMult(2, state[c]) ^ gfMult(3, state[c + 4]) ^ state[c + 8] ^ state[c + 12];
            result[c + 4]  = state[c] ^ gfMult(2, state[c + 4]) ^ gfMult(3, state[c + 8]) ^ state[c + 12];
            result[c + 8]  = state[c] ^ state[c + 4] ^ gfMult(2, state[c + 8]) ^ gfMult(3, state[c + 12]);
            result[c + 12] = gfMult(3, state[c]) ^ state[c + 4] ^ state[c + 8] ^ gfMult(2, state[c + 12]);
        }
        return result;
    }

    private static int[] invMixColumns(int[] state) {
        int[] result = new int[16];
        for (int c = 0; c < 4; c++) {
            result[c]      = gfMult(0x0e, state[c]) ^ gfMult(0x0b, state[c + 4]) ^ gfMult(0x0d, state[c + 8]) ^ gfMult(0x09, state[c + 12]);
            result[c + 4]  = gfMult(0x09, state[c]) ^ gfMult(0x0e, state[c + 4]) ^ gfMult(0x0b, state[c + 8]) ^ gfMult(0x0d, state[c + 12]);
            result[c + 8]  = gfMult(0x0d, state[c]) ^ gfMult(0x09, state[c + 4]) ^ gfMult(0x0e, state[c + 8]) ^ gfMult(0x0b, state[c + 12]);
            result[c + 12] = gfMult(0x0b, state[c]) ^ gfMult(0x0d, state[c + 4]) ^ gfMult(0x09, state[c + 8]) ^ gfMult(0x0e, state[c + 12]);
        }
        return result;
    }

    private static int[] addRoundKey(int[] state, int[] roundKey) {
        int[] result = new int[16];
        for (int i = 0; i < 16; i++) {
            result[i] = state[i] ^ roundKey[i];
        }
        return result;
    }

    private static int[] keyExpansion(byte[] key) {
        int keyLen = key.length;
        if (keyLen != 16 && keyLen != 24 && keyLen != 32) {
            throw new IllegalArgumentException("Key must be 16, 24, or 32 bytes");
        }

        int Nk = keyLen / 4;
        int Nr = keyLen == 16 ? 10 : (keyLen == 24 ? 12 : 14);
        int Nw = 4 * (Nr + 1);

        int[] expandedWords = new int[Nw];

        for (int i = 0; i < Nk; i++) {
            expandedWords[i] = ((key[i * 4] & 0xff) << 24)
                    | ((key[i * 4 + 1] & 0xff) << 16)
                    | ((key[i * 4 + 2] & 0xff) << 8)
                    | (key[i * 4 + 3] & 0xff);
        }

        for (int i = Nk; i < Nw; i++) {
            int temp = expandedWords[i - 1];

            if (i % Nk == 0) {
                temp = ((temp << 8) | ((temp >>> 24) & 0xff));
                temp = (SBOX[(temp >>> 24) & 0xff] << 24)
                        | (SBOX[(temp >>> 16) & 0xff] << 16)
                        | (SBOX[(temp >>> 8) & 0xff] << 8)
                        | SBOX[temp & 0xff];
                temp ^= (RCON[i / Nk - 1] << 24);
            } else if (Nk > 6 && i % Nk == 4) {
                temp = (SBOX[(temp >>> 24) & 0xff] << 24)
                        | (SBOX[(temp >>> 16) & 0xff] << 16)
                        | (SBOX[(temp >>> 8) & 0xff] << 8)
                        | SBOX[temp & 0xff];
            }

            expandedWords[i] = expandedWords[i - Nk] ^ temp;
        }

        int[] expandedKey = new int[Nw * 4];
        for (int i = 0; i < Nw; i++) {
            expandedKey[i * 4] = (expandedWords[i] >>> 24) & 0xff;
            expandedKey[i * 4 + 1] = (expandedWords[i] >>> 16) & 0xff;
            expandedKey[i * 4 + 2] = (expandedWords[i] >>> 8) & 0xff;
            expandedKey[i * 4 + 3] = expandedWords[i] & 0xff;
        }
        return expandedKey;
    }

    public static byte[] encryptBlock(byte[] plaintext, byte[] key) {
        if (plaintext.length != 16) {
            throw new IllegalArgumentException("Block must be 16 bytes");
        }

        int Nr = key.length == 16 ? 10 : (key.length == 24 ? 12 : 14);
        int[] expandedKey = keyExpansion(key);

        int[] state = new int[16];
        for (int i = 0; i < 16; i++) state[i] = plaintext[i] & 0xff;

        state = addRoundKey(state, Arrays.copyOfRange(expandedKey, 0, 16));

        for (int round = 1; round < Nr; round++) {
            state = subBytes(state);
            state = shiftRows(state);
            state = mixColumns(state);
            state = addRoundKey(state, Arrays.copyOfRange(expandedKey, round * 16, (round + 1) * 16));
        }

        state = subBytes(state);
        state = shiftRows(state);
        state = addRoundKey(state, Arrays.copyOfRange(expandedKey, Nr * 16, (Nr + 1) * 16));

        byte[] result = new byte[16];
        for (int i = 0; i < 16; i++) result[i] = (byte) state[i];
        return result;
    }

    public static byte[] decryptBlock(byte[] ciphertext, byte[] key) {
        if (ciphertext.length != 16) {
            throw new IllegalArgumentException("Block must be 16 bytes");
        }

        int Nr = key.length == 16 ? 10 : (key.length == 24 ? 12 : 14);
        int[] expandedKey = keyExpansion(key);

        int[] state = new int[16];
        for (int i = 0; i < 16; i++) state[i] = ciphertext[i] & 0xff;

        state = addRoundKey(state, Arrays.copyOfRange(expandedKey, Nr * 16, (Nr + 1) * 16));
        state = invShiftRows(state);
        state = invSubBytes(state);

        for (int round = Nr - 1; round > 0; round--) {
            state = addRoundKey(state, Arrays.copyOfRange(expandedKey, round * 16, (round + 1) * 16));
            state = invMixColumns(state);
            state = invShiftRows(state);
            state = invSubBytes(state);
        }

        state = addRoundKey(state, Arrays.copyOfRange(expandedKey, 0, 16));

        byte[] result = new byte[16];
        for (int i = 0; i < 16; i++) result[i] = (byte) state[i];
        return result;
    }

    public static byte[] pad(byte[] data) {
        int paddingLen = 16 - (data.length % 16);
        byte[] result = Arrays.copyOf(data, data.length + paddingLen);
        Arrays.fill(result, data.length, result.length, (byte) paddingLen);
        return result;
    }

    public static byte[] unpad(byte[] data) {
        int paddingLen = data[data.length - 1] & 0xff;
        if (paddingLen < 1 || paddingLen > 16) {
            throw new IllegalArgumentException("Invalid padding");
        }
        return Arrays.copyOf(data, data.length - paddingLen);
    }

    public static byte[] encrypt(byte[] plaintext, byte[] key) {
        byte[] padded = pad(plaintext);
        byte[] ciphertext = new byte[padded.length];

        for (int i = 0; i < padded.length; i += 16) {
            byte[] block = Arrays.copyOfRange(padded, i, i + 16);
            byte[] encrypted = encryptBlock(block, key);
            System.arraycopy(encrypted, 0, ciphertext, i, 16);
        }
        return ciphertext;
    }

    public static byte[] decrypt(byte[] ciphertext, byte[] key) {
        if (ciphertext.length % 16 != 0) {
            throw new IllegalArgumentException("Ciphertext length must be multiple of 16");
        }

        byte[] plaintext = new byte[ciphertext.length];
        for (int i = 0; i < ciphertext.length; i += 16) {
            byte[] block = Arrays.copyOfRange(ciphertext, i, i + 16);
            byte[] decrypted = decryptBlock(block, key);
            System.arraycopy(decrypted, 0, plaintext, i, 16);
        }

        return unpad(plaintext);
    }

    public static void encryptFile(Path inputPath, Path outputPath, byte[] key) throws IOException {
        byte[] plaintext = Files.readAllBytes(inputPath);
        byte[] ciphertext = encrypt(plaintext, key);
        Files.write(outputPath, ciphertext);
    }

    public static void decryptFile(Path inputPath, Path outputPath, byte[] key) throws IOException {
        byte[] ciphertext = Files.readAllBytes(inputPath);
        byte[] plaintext = decrypt(ciphertext, key);
        Files.write(outputPath, plaintext);
    }
}