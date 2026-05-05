package org.easyc.schedule.controller;

import lombok.RequiredArgsConstructor;
import org.easyc.schedule.dto.CalendarDayDto;
import org.easyc.schedule.dto.CalendarRequestDto;
import org.easyc.schedule.dto.ScheduleRequestDto;
import org.easyc.schedule.entity.Schedule;
import org.easyc.schedule.service.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Base64;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/schedule")
public class ScheduleController {

    @Autowired
    private ScheduleService scheduleService;

    @GetMapping("/user")
    public Schedule getUserSchedule(@RequestParam Long id) {
        return scheduleService.getUserSchedule(id);
    }

    @PostMapping("/user/month")
    public List<Map<String, CalendarDayDto>> getUserMonthSchedules(@RequestBody CalendarRequestDto request) {
        return scheduleService.getUserMonthSchedules(request);
    }


    @PostMapping("/user/create")
    public void createUserSchedule(@RequestBody ScheduleRequestDto request) {
        scheduleService.createUserSchedule(request);
    }

    @DeleteMapping("/user/delete")
    public void createUserSchedule(@RequestParam Long id)  {
        scheduleService.deleteUserSchedule(id);
    }
}
