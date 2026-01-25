package org.easyc.common.support;

import org.easyc.common.dto.EnumOption;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;
import java.util.Locale;

@Component
public class EnumOptionMapper {

    private static MessageSource messageSource;

    public EnumOptionMapper(MessageSource messageSource) {
        EnumOptionMapper.messageSource = messageSource;
    }

    public <E extends Enum<E>> List<EnumOption> toOptions(
            Class<E> enumClass,
            String messagePrefix,
            Locale locale
    ) {
        return Arrays.stream(enumClass.getEnumConstants())
                .map(e -> {
                    String code = e.name();
                    String key = messagePrefix + "." + code;
                    String label = messageSource.getMessage(
                            key,
                            null,
                            code,   // fallback
                            locale
                    );
                    return new EnumOption(code, label);
                })
                .toList();
    }

    public static <E extends Enum<E>> EnumOption toOption(
            E enumValue,
            String messagePrefix
    ) {

        Locale locale = LocaleContextHolder.getLocale();
//        System.out.println("### EnumOption locale =" + locale);

        if (locale == null) {
            locale = Locale.KOREA; // 강제로 KO 사용
        }

        if (enumValue == null) {
            return null;
        }

        String code = enumValue.name();
        String key = messagePrefix + "." + code;

        String label = messageSource.getMessage(
                key,
                null,
                code,   // fallback
                locale
        );

        return new EnumOption(code, label);
    }
}
