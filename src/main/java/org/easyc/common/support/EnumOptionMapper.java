package org.easyc.common.support;

import org.easyc.common.dto.EnumOption;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

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

        if (enumValue == null || messagePrefix == null) {
            return null;
        }

        Locale locale = Optional.of(LocaleContextHolder.getLocale())
                .orElse(Locale.KOREA);

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


    public static <E extends Enum<E>> String getLabel(
            E enumValue,
            String messagePrefix
    ) {

        if (enumValue == null || messagePrefix == null) {
            return null;
        }

        Locale locale = Optional.ofNullable(LocaleContextHolder.getLocale())
                .orElse(Locale.KOREA);

        String code = enumValue.name();
        String key = messagePrefix + "." + code;

        return messageSource.getMessage(
                key,
                null,
                code,
                locale
        );
    }
}
