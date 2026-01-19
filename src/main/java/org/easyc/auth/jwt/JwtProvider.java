package org.easyc.auth.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.List;

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

    private final Key accessTokenKey;
    private final Key refreshTokenKey;
    private final long ACCESS_EXP;
    private final long REFRESH_EXP;

//    // 테스트용
//    private static final long ACCESS_TOKEN_EXPIRE = 10 * 1000L; // 10초


    public JwtProvider(
            @Value("${jwt.access.secret}") String accessSecret,
            @Value("${jwt.refresh.secret}") String refreshSecret,
            @Value("${jwt.access.expiration}") long accessExp,
            @Value("${jwt.refresh.expiration}") long refreshExp
    ) {

        this.accessTokenKey = Keys.hmacShaKeyFor(accessSecret.getBytes(StandardCharsets.UTF_8));
        this.refreshTokenKey = Keys.hmacShaKeyFor(refreshSecret.getBytes(StandardCharsets.UTF_8));
//        this.ACCESS_EXP = ACCESS_TOKEN_EXPIRE ; //테스트용
        this.ACCESS_EXP = accessExp;
        this.REFRESH_EXP = refreshExp;
    }


    public String createAccessToken(Authentication auth) {

        String role = auth.getAuthorities().iterator().next().getAuthority();

        return Jwts.builder()
                    .setSubject(auth.getName()) // loginId
                    .claim("role", role)
                    .setIssuedAt(new Date())
                    .setExpiration(new Date(System.currentTimeMillis() + ACCESS_EXP))
//                    .signWith(SignatureAlgorithm.HS256, SECRET) // 구식 - 문자열 서명, 보안적으로 권장하지 않음.
                    .signWith(accessTokenKey)
                    .compact();
    }

    public String createRefreshToken(Authentication auth) {

        String role = auth.getAuthorities().iterator().next().getAuthority();

        return Jwts.builder()
                    .setSubject(auth.getName()) // loginId
                    .claim("role", role)
                    .setIssuedAt(new Date())
                    .setExpiration(new Date(System.currentTimeMillis() + REFRESH_EXP))
//                    .signWith(SignatureAlgorithm.HS256, SECRET) // 구식 - 문자열 서명, 보안적으로 권장하지 않음.
                    .signWith(refreshTokenKey)
                    .compact();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(accessTokenKey)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }


    public boolean validateRefreshToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(refreshTokenKey)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public Authentication getAuthenticationFromRefreshToken(String refreshToken) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(refreshTokenKey)
                .build()
                .parseClaimsJws(refreshToken)
                .getBody();

        String loginId = claims.getSubject();
        String role = claims.get("role", String.class);

        return new UsernamePasswordAuthenticationToken(
                loginId,
                null,
                List.of(new SimpleGrantedAuthority(role)) // role_~
        );
    }


    public String getSubject(String token) {
        Jws<Claims> claimsJws = Jwts.parserBuilder()
                .setSigningKey(accessTokenKey)
                .build()
                .parseClaimsJws(token);

        return claimsJws.getBody().getSubject();
    }


    public String getRole(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(accessTokenKey)
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.get("role", String.class);
    }

}
