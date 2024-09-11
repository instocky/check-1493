function getPageType(url) {
    const path = new URL(url).pathname;
    const segments = path.split('/').filter(Boolean);
    const lastSegment = segments[segments.length - 1];

    const pageTypes = {
        "common": "Основные сведения",
        "struct": "Структура и органы управления образовательной организацией",
        "document": "Документы",
        "education": "Образование",
        "eduStandarts": "Образовательные стандарты и требования",
        "managers": "Руководство",
        "employees": "Педагогический состав",
        "objects": "Материально-техническое обеспечение и оснащённость образовательного процесса. Доступная среда",
        "grants": "Стипендии и меры поддержки обучающихся",
        "paid_edu": "Платные образовательные услуги",
        "budget": "Финансово-хозяйственная деятельность",
        "vacant": "Вакантные места для приёма (перевода) обучающихся",
        "inter": "Международное сотрудничество",
        "catering": "Организация питания в образовательной организации",
    };

    return pageTypes[lastSegment] || null;
}

function analyzePage() {
    const url = window.location.href;
    const pageType = getPageType(url);

    if (!pageType) {
        return { type: 'unsupported', message: 'Непроверяемая страница' };
    }

    const slug = url.split('/').pop();
    const itemprops = JSON.parse('{"Основные сведения":["copy","addressPlaceGia","addressPlacePrac","nameUchred","uchredLaw","regDate","addressPlaceOppo","email","workTime","shortName","addressPlaceDop","fullName","websiteUchred","licenseDocLink","addressPlacePodg","telUchred","accreditationDocLink","telephone","addressUchred","mailUchred","addressPlaceSet","address"],"Структура и органы управления образовательной организацией":["site","workTimeRep","websiteRep","copy","addressFil","name","emailFil","structOrgUprav","email","repInfo","nameFil","fioPost","emailRep","filInfo","post","fio","workTimeFil","divisionClauseDocLink","websiteFil","telephoneFil","addressRep","nameRep","telephoneRep","addressStr"],"Документы":["modeDocLink","localActCollec","localActOrder","priemDocLink","localActStud","prescriptionDocLink","copy","ustavDocLink","tekKontrolDocLink","vozDocLink","reportEduDocLink","perevodDocLink"],"Образование":["eduName","eduLevel","eduPriemEl","educationPlan","methodology","t1","perechenNir","eduPred","copy","eduEl","napravNir","dateEnd","eduNir","opMain","eduPrac","graduateJob","eduPr","resultNir","educationRpd","eduCode","eduChislenEl","eduPerevodEl","eduOAccred","orgName","eduAdOp","learningTerm","educationShedule","languageEl","eduProf","v1","eduPOAccred","eduAccred","eduForm","eduOp","baseNir"],"Образовательные стандарты и требования":["eduStandartTreb","eduStandartDoc","copy","eduFedTreb","eduFedDoc"],"Руководство":["rucovodstvoRep","rucovodstvo","rucovodstvoFil","rucovodstvoZam","fio","telephone","email","nameRep","nameFil","copy","post"],"Педагогический состав":["teachingStaff","employeeQualification","fio","specExperience","teachingLevel","teachingOp","academStat","profDevelopment","copy","degree","teachingDiscipline","genExperience","post"],"Материально-техническое обеспечение и оснащённость образовательного процесса. Доступная среда":["eoisSide","interNum","erList","hostelNum","copy","objOvz","purposeCab","hostelInterOvz","localActObSt","purposeSport","osnCab","techOvz","ovz","purposePrac","interInfo","addressCab","objSq","interNumOvz","bdec","comNetOvz","interlNumOvz","namePrac","addressPrac","comNet","objAddress","ovzCab","objName","osnPrac","purposeLibr","eoisOwn","hostelNumOvz","hostelInfo","purposeEios","ovzPrac","purposeFacil","nameCab","purposeFacilOvz","erListOvz","objCnt"],"Стипендии и меры поддержки обучающихся":["interNum","localAct","interlNumOvz","hostelNum","grant","copy","interInfo","interNumOvz","hostelNumOvz","localActObSt","hostelInfo","support"],"Платные образовательные услуги":["paidParents","paidDog","copy","paidEdu","paidSt"],"Финансово-хозяйственная деятельность":["finPVolume","finBFVolume","finBMVolume","finPlanDocLink","finBRVolume","volume","copy","finYear","finRas","finPost"],"Вакантные места для приёма (перевода) обучающихся":["numberBMVacant","eduLevel","eduName","eduProf","numberBFVacant","numberBRVacant","copy","numberPVacant","eduForm","vacant","eduCode","eduCourse"],"Международное сотрудничество":["orgName","stateName","copy","internationalDog","dogReg"],"Организация питания в образовательной организации":["objAddress","objCnt","objName","parent","child","copy","objOvz","objSq","health","meals"]}');

    const foundItems = [];
    const missingItems = [];
    const hiddenItems = [];

    itemprops[pageType].forEach(prop => {
        // Исключаем 'child' и 'parent' из проверки
        if (prop === 'child' || prop === 'parent') {
            return; // Пропускаем итерацию для этих свойств
        }

        const element = document.querySelector(`[itemprop="${prop}"]`);
        if (element) {
            if (element.classList.contains('hidden') && element.textContent.trim() === "Данные обновляются") {
                hiddenItems.push(prop);
            } else {
                foundItems.push(prop);
            }
        } else {
            missingItems.push(prop);
        }
    });

    return {
        type: 'analysis',
        pageType,
        foundItems,
        missingItems,
        hiddenItems
    };
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'analyzeItemprops') {
        sendResponse(analyzePage());
    }
});