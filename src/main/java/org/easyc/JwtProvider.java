package org.easyc;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Component
public class JwtProvider {

    // 서명용 Key 객체
    // JWT 서명용 "안전한 비밀키(Key 객체)"를 만들어주는 헬퍼
    // secret 길이 검증함 (HS256 → 최소 256bit)
    // jjwt가 안전하지 않으면 바로 에러냄

//    private static final String SECRET =
//            "Qx9!kA2$eP7L@rD4m#ZB8YcJw0NfT%S*"; // 32바이트 이상
//    private final Key key =
//            Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));
//    private final long EXP = 1000 * 60 * 60;

    private final Key key;
    private final long EXP;

    public JwtProvider(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.expiration}") long exp) {

        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.EXP = exp;
    }


    public String createToken(Authentication auth) {

        return Jwts.builder()
                    .setSubject(auth.getName()) // loginId
                    .setIssuedAt(new Date())
                    .setExpiration(new Date(System.currentTimeMillis() + EXP))
//                    .signWith(SignatureAlgorithm.HS256, SECRET) // 구식 - 문자열 서명, 보안적으로 권장하지 않음.
                    .signWith(key)
                    .compact();
    }


    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public String getSubject(String token) {
        Jws<Claims> claimsJws = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token);

        return claimsJws.getBody().getSubject();
    }

}
