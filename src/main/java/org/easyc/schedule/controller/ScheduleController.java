package org.easyc.schedule.controller;

import lombok.RequiredArgsConstructor;
import org.easyc.schedule.dto.CalendarDayDto;
import org.easyc.schedule.dto.CalendarRequestDto;
import org.easyc.schedule.service.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/schedule")
public class ScheduleController {

    @Autowired
    private ScheduleService scheduleService;

    @PostMapping("/user/month")
    public List<Map<String, CalendarDayDto>> getUserMonthSchedules(@RequestBody CalendarRequestDto request) {
        return scheduleService.getUserMonthSchedules(request);
    }
}
