package org.easyc.auth.jwt;

import java.security.SecureRandom;
import java.util.Base64;


public class JwtKeyGenerator {
//    JWT Secret key 생성용

    /*
    * HS256 키 발급 조건
    * - 최소 256bit(32 bytes)
    * - 랜점
    * - 서버만 알고 있어야 함.
    *
    *
    * SecureRandom 기반 키 생성
    * - 예측 불가능성을 보장하는 난수 생성기
    * - 알고리즘에 종속되지 않음
    * */

    public static void main(String[] args) {
        SecureRandom secureRandom = new SecureRandom();
        byte[] key = new byte[32]; // 256bit
        secureRandom.nextBytes(key);

        String base64Key = Base64.getEncoder().encodeToString(key);
        System.out.println(base64Key);
    }
}