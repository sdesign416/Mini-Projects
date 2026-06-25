// 객체 가져오기
const subjectInput = document.getElementById("subjectInput")
const contentInput = document.getElementById("contentInput")
const dateInput = document.getElementById("dateInput")
const addBtn = document.getElementById("addBtn")
const remainingCount = document.getElementById("remainingCount")
const totalCount = document.getElementById("totalCount")
const SPList = document.getElementById("SPList")
const dateSortBtn = document.getElementById("dateSortBtn")

// 달력 어딜클릭해도 달력선택창 나타나도록 설정
dateInput.addEventListener("click", () => {
   dateInput.showPicker()
})


// 배열에 저장
const plans = []


// [D-DAY 계산]
function getDday(data) {
   const today = new Date() // 오늘 날짜
   const targetDate = new Date(data) // 목표 날짜

   // 날짜비교
   today.setHours(0, 0, 0, 0)
   targetDate.setHours(0, 0, 0, 0)

   // 남은날짜 = 목표날짜 - 오늘날짜
   const remainTime = targetDate - today

   // 초를 일단위로 변환
   const remainDay = Math.ceil(remainTime / (1000 * 60 * 60 * 24))

   // 남은 날짜에 따라 D-DAY 바뀌도록 출력
   if (remainDay > 0) {
      return `D-${remainDay}`
   } else if (remainDay == 0) {
      return "D-Day"
   } else {
      // 목표날짜 지나면 음수되는데 양수로 변환 후 출력
      return `D+${Math.abs(remainDay)}`
   }

}

// [등록 시 보일 화면]
function render() {
   // 기본설정: li 비움
   SPList.innerHTML = ""

   // 배열 채워지면
   plans.forEach((plan, index) => {
      // 1) li 생성
      const li = document.createElement("li")
      if (plan.done) li.classList.add("done")

      // 2) 체크박스
      const checkbox = document.createElement("input")
      checkbox.type = "checkbox"
      checkbox.checked = plan.done
      // :체크하면 스타일 적용
      checkbox.addEventListener("change", () => {
         plan.done = checkbox.checked
         render()
      })

      // 3) li > div.info 생성 (input 입력받은것들)
      const info = document.createElement("div")
      info.className = "info"

      // 3_1) D-DAY
      const dday = document.createElement("p")
      dday.className = "dday"
      dday.textContent = getDday(plan.date)

      // 3_2) 마감 날짜
      // const date = document.createElement("p")
      // date.className = "date"
      // date.textContent = plan.date

      // 3_3) 과목
      const subject = document.createElement("p")
      subject.className = "subject"
      subject.textContent = plan.subject

      // 3_4) 상세 내용
      const content = document.createElement("p")
      content.className = "content"
      content.textContent = plan.content


      // info 조립
      info.appendChild(dday)
      // info.appendChild(date)
      info.appendChild(subject)
      info.appendChild(content)

      // 4) 삭제 버튼
      const delBtn = document.createElement("button")
      delBtn.type = "button"
      delBtn.className = "delBtn"
      delBtn.textContent = "삭제"
      delBtn.addEventListener("click", () => {
         // 삭제진행, 다시 render
         plans.splice(index, 1)
         render()
      })

      // li, ul 최종 조립
      li.appendChild(checkbox)
      li.appendChild(info)
      li.appendChild(delBtn)
      SPList.appendChild(li)
   })
   
   // 정렬 버튼 표시 여부
   if (plans.length > 0) {
      dateSortBtn.style.display = "block"
   } else {
      dateSortBtn.style.display = "none"
   }

   // 카운트 함수 호출
   updateCounts()
}


// [카운트]
function updateCounts() {
   // 전체 개수
   const total = plans.length
   totalCount.textContent = total

   // 남은 개수
   const remaining = plans.filter(plan => !plan.done).length
   remainingCount.textContent = remaining
}

// [계획 등록]
function addPlan() {
   // 공백제거 후 입력값 받음
   const subject = subjectInput.value.trim()
   const content = contentInput.value.trim()
   const date = dateInput.value

   // 텍스트 비어있으면 걸러냄
   if (!subject) return
   if (!content) return
   if (!date) return

   // 배열에 객체로 추가
   plans.push({
      subject,
      content,
      date,
      done: false
   })

   // 등록 후 입력창 초기화
   subjectInput.value = ""
   contentInput.value = ""
   dateInput.value = ""

   // 초기화 시 과목입력에 다시 focus
   subjectInput.focus()

   // 생성
   render()
}


// [추가버튼 작동]
addBtn.addEventListener("click", addPlan)


// [마감일순 정렬]
dateSortBtn.addEventListener("click", () => {
   plans.sort((a, b) => {
      return new Date(a.date) - new Date(b.date)
   })
   render()
})

// [초기 화면 출력]
render()