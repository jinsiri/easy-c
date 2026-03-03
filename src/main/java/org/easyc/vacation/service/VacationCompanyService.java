package org.easyc.vacation.service;

import lombok.RequiredArgsConstructor;
import org.easyc.common.dto.SearchRequestDto;
import org.easyc.member.repository.MemberProfileRepository;
import org.easyc.member.repository.MemberRepository;
import org.easyc.vacation.entity.Vacation;
import org.easyc.vacation.entity.VacationApplication;
import org.easyc.vacation.repository.VacationPolicyMapRepository;
import org.easyc.vacation.repository.VacationPolicyRepository;
import org.easyc.vacation.repository.VacationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VacationCompanyService {

    private final VacationPolicyRepository vacationPolicyRepository;
    private final VacationPolicyMapRepository vacationPolicyMapRepository;
    private final MemberRepository memberRepository;
    private final MemberProfileRepository memberProfileRepository;
    private final VacationRepository vacationRepository;

    public List<Vacation> getVacationCompanySearch(SearchRequestDto request){
        String searchCategory = request.getSearchCategory();
        String searchValue = request.getSearchValue();

        List<Vacation> vacationList = new ArrayList<>();
        if(searchValue== null || searchValue.equals("")){
            vacationList = vacationRepository.findAll();
        }

        return vacationList;
    }



}
