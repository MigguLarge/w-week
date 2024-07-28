class Week {
    /**
     * @param {string} title
     * @param {string} startDate
     */
    constructor(title, startDate) {
        this.title = title;
        this.startDate = startDate;
    }
}

const addWeekForm = document.querySelector("#add-week");
const weekTitleInput = document.getElementById("w-title");
const weekStartDateInput = document.getElementById("w-start-date");
const weekList = document.querySelector(".week-list");

/**
 * @param {string} startDate
 * @return {string} Text of W-Week calculation.
 */
const getWWeek = (startDateStr) => {
    const msPerWeek = 1000 * 60 * 60 * 24 * 7;

    const currentDate = new Date();
    const currentDateUTC = Date.UTC(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
    );

    const startDate = new Date(startDateStr);
    const startingDateUTC = Date.UTC(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate(),
    );

    const weekDifference = Math.floor(
        (currentDateUTC - startingDateUTC) / msPerWeek,
    );

    if (weekDifference >= 0) {
        return `${weekDifference + 1}주차`;
    }
    return `${weekDifference}주차`;
};

/**
 * Add W-Week list element
 * @param {string} title
 * @param {string} startDate
 */
const addWeek = (title, startDate) => {
    const week = new Week(title, startDate);

    if (localStorage.hasOwnProperty("weeks")) {
        /** @type {Week[]} */
        const weeks = JSON.parse(localStorage.getItem("weeks"));
        if (weeks.some((obj) => obj.title == week.title)) {
            window.alert("같은 이름의 주가 이미 존재해요.");
            return;
        }
        weeks.push(week);
        localStorage.setItem("weeks", JSON.stringify(weeks));
    } else {
        localStorage.setItem("weeks", JSON.stringify([week]));
    }

    const li = document.createElement("li");

    const weekTitle = document.createElement("span");
    weekTitle.classList.add("w-title");
    weekTitle.textContent = title;

    const weekStartDate = document.createElement("span");
    weekStartDate.classList.add("w-week");
    weekStartDate.textContent = getWWeek(startDate);

    const weekDelete = document.createElement("span");
    weekDelete.classList.add("w-delete");
    weekDelete.textContent = "×";

    weekDelete.addEventListener("click", () => deleteWeek(title));

    weekList.appendChild(li);
    li.appendChild(weekTitle);
    li.appendChild(weekStartDate);
    li.appendChild(weekDelete);
};

const deleteWeek = (weekTitle) => {
    if (localStorage.hasOwnProperty("weeks")) {
        window.alert("정말로 이 주를 삭제하시겠어요?");

        /** @type {Week[]} */
        const weeks = JSON.parse(localStorage.getItem("weeks"));
        const newWeek = weeks.filter((week) => week.title != weekTitle);
        localStorage.setItem("weeks", JSON.stringify(newWeek));
        renderWeeks(newWeek);
    } else {
        window.alert("존재하는 W-Week가 없어요.");
    }
};

/**
 * Should be run on the page load
 */
const renderWeeks = (weeks) => {
    weekList.innerHTML = "";
    for (let week of weeks) {
        console.log(week);
        const li = document.createElement("li");

        const weekTitle = document.createElement("span");
        weekTitle.classList.add("w-title");
        weekTitle.textContent = week.title;

        const weekStartDate = document.createElement("span");
        weekStartDate.classList.add("w-week");
        weekStartDate.textContent = getWWeek(week.startDate);

        const weekDelete = document.createElement("span");
        weekDelete.classList.add("w-delete");
        weekDelete.textContent = "×";

        weekDelete.addEventListener("click", () => deleteWeek(week.title));

        weekList.appendChild(li);
        li.appendChild(weekTitle);
        li.appendChild(weekStartDate);
        li.appendChild(weekDelete);
    }
};

if (localStorage.hasOwnProperty("weeks")) {
    renderWeeks(JSON.parse(localStorage.getItem("weeks")));
}

weekStartDateInput.valueAsDate = new Date();

addWeekForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const title = weekTitleInput.value;
    const startDate = weekStartDateInput.value;
    addWeek(title, startDate);

    weekTitleInput.value = "";
    weekStartDateInput.valueAsDate = new Date();
});
