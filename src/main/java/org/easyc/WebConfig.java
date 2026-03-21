//package org.easyc;
//
//import org.springframework.context.annotation.Configuration;
//import org.springframework.web.servlet.config.annotation.CorsRegistry;
//import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
//
//@Configuration
//public class WebConfig implements WebMvcConfigurer {
//
//    @Override
//    public void addCorsMappings(CorsRegistry registry) {
//        registry.addMapping("/**") // 모든 엔드포인트 허용
//                // 개발용 (프론트 포트 변경되어도 허용, 배포 시 보안상 위험하므로 반드시 배포용에서는 특정 오리진만 허용)
//                // 이대로 배포 원하는 경우, 배포시 프록시 설정 필요 (예: nginx에서 /api로 들어오는 요청만 백엔드로 프록시)
//                .allowedOriginPatterns("*")
//
//                // 프론트 주소
////                .allowedOrigins("http://localhost:3000")
////                .allowedOriginPatterns("https://*.mycompany.com")
//                .allowedMethods("GET", "POST", "PUT", "DELETE")
//                .allowCredentials(true); // 쿠키 허용
//    }
//}

package org.easyc;

import lombok.RequiredArgsConstructor;
import org.easyc.audit.access.AccessLogInterceptor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@RequiredArgsConstructor
public class WebConfig implements WebMvcConfigurer {

    private final AccessLogInterceptor accessLogInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(accessLogInterceptor)
                .addPathPatterns("/api/**");
    }
}
