localStorage.clear();
console.log("localStorage 已清除");
// 修改數據初始化和存儲方式
const DEFAULT_CHILDREN_DATA = {
  Audrey: {
    points: 0,
    positiveBehaviors: [
      {
        id: 1,
        name: "主動做作業",
        description: "沒有提醒的情況下，自己完成作業",
        points: 1,
        tags: ["學習", "責任"],
      },
      {
        id: 2,
        name: "幫忙做家事",
        description: "主動做家事、準備餐點，每件事加一點。",
        points: 1,
        tags: ["責任", "生活習慣"],
      },
    ],
    negativeBehaviors: [
      {
        id: 1,
        name: "拖延做作業",
        description: "多次提醒仍未開始做作業，或作業拖欠",
        points: 1,
        tags: ["責任"],
      },
      {
        id: 2,
        name: "沒有自主整理",
        description: "使用過的玩具、書籍、桌面沒整理",
        points: 1,
        tags: ["生活習慣"],
      },
    ],
  },
  Alex: {
    points: 0,
    positiveBehaviors: [
      {
        id: 1,
        name: "習慣一",
        description: "習慣一描述",
        points: 1,
        tags: ["責任"],
      },
      {
        id: 2,
        name: "習慣二",
        description: "習慣二描述",
        points: 1,
        tags: ["學習", "生活習慣"],
      },
    ],
    negativeBehaviors: [
      {
        id: 1,
        name: "改善一",
        description: "改善一描述",
        points: 1,
        tags: ["健康", "生活習慣"],
      },
      {
        id: 2,
        name: "改善二",
        description: "改善二描述",
        points: 1,
        tags: ["生活習慣"],
      },
    ],
  },
};

// 數據操作相關函數
const DataManager = {
  // 獲取所有數據
  getData() {
    const savedData = localStorage.getItem("childrenData");
    return savedData ? JSON.parse(savedData) : DEFAULT_CHILDREN_DATA;
  },

  // 保存所有數據
  saveData(data) {
    localStorage.setItem("childrenData", JSON.stringify(data));
  },

  // 更新特定小孩的數據
  updateChildData(childName, data) {
    const allData = this.getData();
    allData[childName] = data;
    this.saveData(allData);
  },

  // 獲取計數器
  getBehaviorCounter() {
    const counter = localStorage.getItem("behaviorIdCounter");
    return counter ? JSON.parse(counter) : { positive: 3, negative: 3 };
  },

  // 保存計數器
  saveBehaviorCounter(counter) {
    localStorage.setItem("behaviorIdCounter", JSON.stringify(counter));
  },
};

// 修改初始化部分
let childrenData = DataManager.getData();
let behaviorIdCounter = DataManager.getBehaviorCounter();
let currentChild = localStorage.getItem("currentChild") || "Audrey";

// 添加分頁相關變量
let currentPage = 1;
const pointsPerPage = 15;

// DOM元素
const childSelect = document.getElementById("childSelect");
const childNameElement = document.getElementById("childName");
const totalPointsElement = document.getElementById("totalPoints");
const pointsContainer = document.getElementById("pointsContainer");
const positiveBehaviorsContainer = document.getElementById("positiveBehaviors");
const negativeBehaviorsContainer = document.getElementById("negativeBehaviors");

// Modal元素
const addPositiveModal = new bootstrap.Modal(
  document.getElementById("addPositiveModal")
);
const addNegativeModal = new bootstrap.Modal(
  document.getElementById("addNegativeModal")
);
const exchangeModal = new bootstrap.Modal(
  document.getElementById("exchangeModal")
);
const editPositiveModal = new bootstrap.Modal(
  document.getElementById("editPositiveModal")
);
const editNegativeModal = new bootstrap.Modal(
  document.getElementById("editNegativeModal")
);
const resetConfirmModal = new bootstrap.Modal(
  document.getElementById("resetConfirmModal")
);

// 添加這個函數來檢查 LocalStorage
function checkLocalStorage() {
  try {
    localStorage.setItem("test", "test");
    localStorage.removeItem("test");
    return true;
  } catch (e) {
    console.error("LocalStorage is not available:", e);
    return false;
  }
}

// 初始化頁面
function initializePage() {
  if (!checkLocalStorage()) {
    alert(
      "警告：本應用需要瀏覽器的 LocalStorage 支持。請確保您沒有禁用 LocalStorage，並且不在隱私模式下運行。"
    );
  }
  loadChildData();

  // 監聽切換小孩選單
  childSelect.addEventListener("change", function () {
    currentChild = this.value;
    loadChildData();
  });

  // 監聽新增正向行為按鈕
  document
    .getElementById("addPositiveBtn")
    .addEventListener("click", function () {
      addPositiveModal.show();
    });

  // 監聽新增需改善行為按鈕
  document
    .getElementById("addNegativeBtn")
    .addEventListener("click", function () {
      addNegativeModal.show();
    });

  // 監聽儲存正向行為按鈕
  document
    .getElementById("savePositiveBtn")
    .addEventListener("click", function () {
      const name = document.getElementById("positiveBehaviorName").value;
      const description = document.getElementById("positiveBehaviorDesc").value;
      const points = parseInt(document.getElementById("positivePoints").value);

      // 收集標籤
      const tags = [];
      if (document.getElementById("positiveTagLearning").checked)
        tags.push("學習");
      if (document.getElementById("positiveTagHealth").checked)
        tags.push("健康");
      if (document.getElementById("positiveTagResponsibility").checked)
        tags.push("責任");
      if (document.getElementById("positiveTagHabits").checked)
        tags.push("生活習慣");

      if (name && points) {
        const newBehavior = {
          id: behaviorIdCounter.positive,
          name: name,
          description: description,
          points: points,
          tags: tags,
        };

        addPositiveBehavior(newBehavior);
        document.getElementById("positiveForm").reset();
        addPositiveModal.hide();
      }
    });

  // 監聽儲存需改善行為按鈕
  document
    .getElementById("saveNegativeBtn")
    .addEventListener("click", function () {
      const name = document.getElementById("negativeBehaviorName").value;
      const description = document.getElementById("negativeBehaviorDesc").value;
      const points = parseInt(document.getElementById("negativePoints").value);

      // 收集標籤
      const tags = [];
      if (document.getElementById("negativeTagLearning").checked)
        tags.push("學習");
      if (document.getElementById("negativeTagHealth").checked)
        tags.push("健康");
      if (document.getElementById("negativeTagResponsibility").checked)
        tags.push("責任");
      if (document.getElementById("negativeTagHabits").checked)
        tags.push("生活習慣");

      if (name && points) {
        const newBehavior = {
          id: behaviorIdCounter.negative,
          name: name,
          description: description,
          points: points,
          tags: tags,
        };

        addNegativeBehavior(newBehavior);
        document.getElementById("negativeForm").reset();
        addNegativeModal.hide();
      }
    });

  // 監聽兌換按鈕
  document.getElementById("exchangeBtn").addEventListener("click", function () {
    document.getElementById("pointsWarning").style.display = "none";
    document.getElementById("exchangeForm").reset();
    exchangeModal.show();
  });

  // 監聽確認兌換按鈕
  document
    .getElementById("confirmExchangeBtn")
    .addEventListener("click", function () {
      const name = document.getElementById("exchangeItemName").value;
      const description = document.getElementById("exchangeItemDesc").value;
      const exchangePoints = parseInt(
        document.getElementById("exchangePoints").value
      );
      const category = document.getElementById("exchangeCategory").value;

      if (name && exchangePoints) {
        if (exchangePoints <= childrenData[currentChild].points) {
          childrenData[currentChild].points -= exchangePoints;
          DataManager.updateChildData(currentChild, childrenData[currentChild]);
          updateTotalPoints();
          renderPointsCard();
          exchangeModal.hide();
          alert(
            `成功兌換「${name}」(${category})，消耗了 ${exchangePoints} 點數！`
          );
        } else {
          document.getElementById("pointsWarning").style.display = "block";
        }
      }
    });

  // 監聽更新正向行為按鈕
  document
    .getElementById("updatePositiveBtn")
    .addEventListener("click", function () {
      const id = parseInt(
        document.getElementById("editPositiveBehaviorId").value
      );
      const name = document.getElementById("editPositiveBehaviorName").value;
      const description = document.getElementById(
        "editPositiveBehaviorDesc"
      ).value;
      const points = parseInt(
        document.getElementById("editPositivePoints").value
      );

      // 收集標籤
      const tags = [];
      if (document.getElementById("editPositiveTagLearning").checked)
        tags.push("學習");
      if (document.getElementById("editPositiveTagHealth").checked)
        tags.push("健康");
      if (document.getElementById("editPositiveTagResponsibility").checked)
        tags.push("責任");
      if (document.getElementById("editPositiveTagHabits").checked)
        tags.push("生活習慣");

      if (name && points) {
        const behaviorIndex = childrenData[
          currentChild
        ].positiveBehaviors.findIndex((b) => b.id === id);
        if (behaviorIndex !== -1) {
          childrenData[currentChild].positiveBehaviors[behaviorIndex] = {
            id,
            name,
            description,
            points,
            tags,
          };
          DataManager.updateChildData(currentChild, childrenData[currentChild]);
          renderPositiveBehaviors();
          editPositiveModal.hide();
        }
      }
    });

  // 監聽更新需改善行為按鈕
  document
    .getElementById("updateNegativeBtn")
    .addEventListener("click", function () {
      const id = parseInt(
        document.getElementById("editNegativeBehaviorId").value
      );
      const name = document.getElementById("editNegativeBehaviorName").value;
      const description = document.getElementById(
        "editNegativeBehaviorDesc"
      ).value;
      const points = parseInt(
        document.getElementById("editNegativePoints").value
      );

      // 收集標籤
      const tags = [];
      if (document.getElementById("editNegativeTagLearning").checked)
        tags.push("學習");
      if (document.getElementById("editNegativeTagHealth").checked)
        tags.push("健康");
      if (document.getElementById("editNegativeTagResponsibility").checked)
        tags.push("責任");
      if (document.getElementById("editNegativeTagHabits").checked)
        tags.push("生活習慣");

      if (name && points) {
        const behaviorIndex = childrenData[
          currentChild
        ].negativeBehaviors.findIndex((b) => b.id === id);
        if (behaviorIndex !== -1) {
          childrenData[currentChild].negativeBehaviors[behaviorIndex] = {
            id,
            name,
            description,
            points,
            tags,
          };
          DataManager.updateChildData(currentChild, childrenData[currentChild]);
          renderNegativeBehaviors();
          editNegativeModal.hide();
        }
      }
    });

  // 重置按鈕相關
  const resetDataBtn = document.getElementById("resetDataBtn");
  const resetConfirmInput = document.getElementById("resetConfirmInput");
  const confirmResetBtn = document.getElementById("confirmResetBtn");

  // 顯示確認 Modal
  resetDataBtn.addEventListener("click", function () {
    resetConfirmInput.value = ""; // 清空輸入框
    confirmResetBtn.disabled = true; // 禁用確認按鈕
    resetConfirmModal.show();
  });

  // 監聽確認文字輸入
  resetConfirmInput.addEventListener("input", function () {
    confirmResetBtn.disabled = this.value !== "確定清空";
  });

  // 確認重置
  confirmResetBtn.addEventListener("click", function () {
    if (resetConfirmInput.value === "確定清空") {
      // 清空所有數據
      localStorage.clear();

      // 重置為預設值
      childrenData = DEFAULT_CHILDREN_DATA;
      behaviorIdCounter = { positive: 3, negative: 3 };
      currentChild = "Audrey";
      currentPage = 1;

      // 保存預設數據
      DataManager.saveData(childrenData);
      DataManager.saveBehaviorCounter(behaviorIdCounter);

      // 重新載入頁面
      loadChildData();

      // 關閉 Modal
      resetConfirmModal.hide();

      // 顯示成功訊息
      showToast("數據已清空，已重置為初始狀態。");
    }
  });
}

// 加載小孩數據
function loadChildData() {
  currentPage = 1;
  localStorage.setItem("currentChild", currentChild);
  childNameElement.textContent = `${currentChild}的集點卡`;
  updateTotalPoints();
  renderPointsCard();
  renderPositiveBehaviors();
  renderNegativeBehaviors();
}

// 更新總點數
function updateTotalPoints() {
  totalPointsElement.textContent = childrenData[currentChild].points;
}

// 渲染集點卡
function renderPointsCard() {
  pointsContainer.innerHTML = "";

  // 計算總點數和總頁數
  const totalPoints = Math.max(
    15,
    Math.ceil(childrenData[currentChild].points / 5) * 5
  );
  const totalPages = Math.ceil(totalPoints / pointsPerPage);

  // 計算當前頁面應該顯示的點數範圍
  const startPoint = totalPoints - (currentPage - 1) * pointsPerPage;
  const endPoint = Math.max(startPoint - pointsPerPage, 1);

  // 創建點數數組
  let pointsArray = [];
  for (let i = startPoint; i >= endPoint; i -= 5) {
    let row = [];
    for (let j = 0; j < 5; j++) {
      const pointNumber = i - j;
      if (pointNumber > 0) {
        row.push(pointNumber);
      }
    }
    if (row.length > 0) {
      pointsArray.push(row);
    }
  }

  // 渲染點數
  pointsArray.forEach((row) => {
    const rowDiv = document.createElement("div");
    rowDiv.className = "points-row";

    for (let i = 0; i < 5; i++) {
      const pointDiv = document.createElement("div");
      pointDiv.className = "point-circle";

      if (i < row.length) {
        const pointNumber = row[i];
        pointDiv.textContent = pointNumber;

        if (pointNumber <= childrenData[currentChild].points) {
          pointDiv.classList.add("point-filled");
        }
      } else {
        pointDiv.style.visibility = "hidden";
      }

      rowDiv.appendChild(pointDiv);
    }

    pointsContainer.appendChild(rowDiv);
  });

  // 添加分頁控制
  if (totalPages > 1) {
    const paginationDiv = document.createElement("div");
    paginationDiv.className = "points-pagination";

    // 上一頁按鈕
    const prevBtn = document.createElement("button");
    prevBtn.className = "btn btn-outline-primary me-2";
    prevBtn.textContent = "上一頁";
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => {
      if (currentPage > 1) {
        currentPage--;
        renderPointsCard();
      }
    };

    // 下一頁按鈕
    const nextBtn = document.createElement("button");
    nextBtn.className = "btn btn-outline-primary ms-2";
    nextBtn.textContent = "下一頁";
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => {
      if (currentPage < totalPages) {
        currentPage++;
        renderPointsCard();
      }
    };

    // 頁碼顯示
    const pageInfo = document.createElement("span");
    pageInfo.className = "mx-3";
    pageInfo.textContent = `${currentPage} / ${totalPages} 頁`;

    paginationDiv.appendChild(prevBtn);
    paginationDiv.appendChild(pageInfo);
    paginationDiv.appendChild(nextBtn);
    pointsContainer.appendChild(paginationDiv);
  }
}

// 渲染正向行為
function renderPositiveBehaviors() {
  positiveBehaviorsContainer.innerHTML = "";

  childrenData[currentChild].positiveBehaviors.forEach((behavior) => {
    const card = document.createElement("div");
    card.className = "behavior-card positive-behavior";

    // 構建標籤HTML
    let tagsHtml = "";
    if (behavior.tags && behavior.tags.length > 0) {
      tagsHtml = '<div class="mt-1">';
      behavior.tags.forEach((tag) => {
        let tagClass = "";
        if (tag === "學習") tagClass = "tag-learning";
        else if (tag === "健康") tagClass = "tag-health";
        else if (tag === "責任") tagClass = "tag-responsibility";
        else if (tag === "生活習慣") tagClass = "tag-habits";

        tagsHtml += `<span class="tag ${tagClass}">${tag}</span>`;
      });
      tagsHtml += "</div>";
    }

    card.innerHTML = `
                    <div class="d-flex justify-content-between align-items-start">
                        <div class="behavior-content" style="cursor: pointer">
                            <div><strong>${behavior.name}</strong></div>
                            <div class="text-muted small">${
                              behavior.description || ""
                            }</div>
                            ${tagsHtml}
                        </div>
                        <div class="d-flex flex-column align-items-end">
                            <span class="badge bg-success mb-2">+${
                              behavior.points
                            } 點</span>
                            <div class="btn-group btn-group-sm">
                                <button class="btn btn-outline-secondary btn-edit" data-id="${
                                  behavior.id
                                }">編輯</button>
                                <button class="btn btn-outline-danger btn-delete" data-id="${
                                  behavior.id
                                }">刪除</button>
                            </div>
                        </div>
                    </div>
                `;

    // 點擊行為內容區域增加點數
    const behaviorContent = card.querySelector(".behavior-content");
    behaviorContent.addEventListener("click", function () {
      childrenData[currentChild].points += behavior.points;
      DataManager.updateChildData(currentChild, childrenData[currentChild]);
      updateTotalPoints();
      renderPointsCard();
    });

    // 編輯按鈕事件
    const editBtn = card.querySelector(".btn-edit");
    editBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      openEditPositiveModal(behavior);
    });

    // 刪除按鈕事件
    const deleteBtn = card.querySelector(".btn-delete");
    deleteBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      if (confirm("確定要刪除這個行為卡片嗎？")) {
        deletePositiveBehavior(behavior.id);
      }
    });

    positiveBehaviorsContainer.appendChild(card);
  });
}

// 添加新的函數
function openEditPositiveModal(behavior) {
  document.getElementById("editPositiveBehaviorId").value = behavior.id;
  document.getElementById("editPositiveBehaviorName").value = behavior.name;
  document.getElementById("editPositiveBehaviorDesc").value =
    behavior.description || "";
  document.getElementById("editPositivePoints").value = behavior.points;

  // 重置所有標籤
  document.getElementById("editPositiveTagLearning").checked =
    behavior.tags.includes("學習");
  document.getElementById("editPositiveTagHealth").checked =
    behavior.tags.includes("健康");
  document.getElementById("editPositiveTagResponsibility").checked =
    behavior.tags.includes("責任");
  document.getElementById("editPositiveTagHabits").checked =
    behavior.tags.includes("生活習慣");

  editPositiveModal.show();
}

function deletePositiveBehavior(id) {
  childrenData[currentChild].positiveBehaviors = childrenData[
    currentChild
  ].positiveBehaviors.filter((b) => b.id !== id);
  renderPositiveBehaviors();
}

// 渲染需改善行為
function renderNegativeBehaviors() {
  negativeBehaviorsContainer.innerHTML = "";

  childrenData[currentChild].negativeBehaviors.forEach((behavior) => {
    const card = document.createElement("div");
    card.className = "behavior-card negative-behavior";

    // 構建標籤HTML
    let tagsHtml = "";
    if (behavior.tags && behavior.tags.length > 0) {
      tagsHtml = '<div class="mt-1">';
      behavior.tags.forEach((tag) => {
        let tagClass = "";
        if (tag === "學習") tagClass = "tag-learning";
        else if (tag === "健康") tagClass = "tag-health";
        else if (tag === "責任") tagClass = "tag-responsibility";
        else if (tag === "生活習慣") tagClass = "tag-habits";

        tagsHtml += `<span class="tag ${tagClass}">${tag}</span>`;
      });
      tagsHtml += "</div>";
    }

    card.innerHTML = `
                    <div class="d-flex justify-content-between align-items-start">
                        <div class="behavior-content" style="cursor: pointer">
                            <div><strong>${behavior.name}</strong></div>
                            <div class="text-muted small">${
                              behavior.description || ""
                            }</div>
                            ${tagsHtml}
                        </div>
                        <div class="d-flex flex-column align-items-end">
                            <span class="badge bg-danger mb-2">-${
                              behavior.points
                            } 點</span>
                            <div class="btn-group btn-group-sm">
                                <button class="btn btn-outline-secondary btn-edit" data-id="${
                                  behavior.id
                                }">編輯</button>
                                <button class="btn btn-outline-danger btn-delete" data-id="${
                                  behavior.id
                                }">刪除</button>
                            </div>
                        </div>
                    </div>
                `;

    // 點擊行為內容區域扣除點數
    const behaviorContent = card.querySelector(".behavior-content");
    behaviorContent.addEventListener("click", function () {
      if (childrenData[currentChild].points >= behavior.points) {
        childrenData[currentChild].points -= behavior.points;
        DataManager.updateChildData(currentChild, childrenData[currentChild]);
        updateTotalPoints();
        renderPointsCard();
      } else {
        alert("點數不足，無法扣除！");
      }
    });

    // 編輯按鈕事件
    const editBtn = card.querySelector(".btn-edit");
    editBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      openEditNegativeModal(behavior);
    });

    // 刪除按鈕事件
    const deleteBtn = card.querySelector(".btn-delete");
    deleteBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      if (confirm("確定要刪除這個行為卡片嗎？")) {
        deleteNegativeBehavior(behavior.id);
      }
    });

    negativeBehaviorsContainer.appendChild(card);
  });
}

// 添加需改善行為的編輯和刪除函數
function openEditNegativeModal(behavior) {
  document.getElementById("editNegativeBehaviorId").value = behavior.id;
  document.getElementById("editNegativeBehaviorName").value = behavior.name;
  document.getElementById("editNegativeBehaviorDesc").value =
    behavior.description || "";
  document.getElementById("editNegativePoints").value = behavior.points;

  // 重置所有標籤
  document.getElementById("editNegativeTagLearning").checked =
    behavior.tags.includes("學習");
  document.getElementById("editNegativeTagHealth").checked =
    behavior.tags.includes("健康");
  document.getElementById("editNegativeTagResponsibility").checked =
    behavior.tags.includes("責任");
  document.getElementById("editNegativeTagHabits").checked =
    behavior.tags.includes("生活習慣");

  editNegativeModal.show();
}

function deleteNegativeBehavior(id) {
  childrenData[currentChild].negativeBehaviors = childrenData[
    currentChild
  ].negativeBehaviors.filter((b) => b.id !== id);
  renderNegativeBehaviors();
}

// 添加重置功能
function resetAllData() {
  if (confirm("確定要重置所有數據嗎？這將清除所有積分和行為記錄。")) {
    localStorage.clear();
    childrenData = DEFAULT_CHILDREN_DATA;
    behaviorIdCounter = { positive: 3, negative: 3 };
    currentChild = "Audrey";
    DataManager.saveData(childrenData);
    DataManager.saveBehaviorCounter(behaviorIdCounter);
    loadChildData();
  }
}

// 修改行為相關操作
function addPositiveBehavior(behavior) {
  childrenData[currentChild].positiveBehaviors.push(behavior);
  DataManager.updateChildData(currentChild, childrenData[currentChild]);
  behaviorIdCounter.positive++;
  DataManager.saveBehaviorCounter(behaviorIdCounter);
  renderPositiveBehaviors();
}

function addNegativeBehavior(behavior) {
  childrenData[currentChild].negativeBehaviors.push(behavior);
  DataManager.updateChildData(currentChild, childrenData[currentChild]);
  behaviorIdCounter.negative++;
  DataManager.saveBehaviorCounter(behaviorIdCounter);
  renderNegativeBehaviors();
}

// 添加 Toast 通知功能
function showToast(message) {
  const toastContainer = document.createElement("div");
  toastContainer.className =
    "toast-container position-fixed bottom-0 end-0 p-3";
  toastContainer.innerHTML = `
                <div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="toast-header">
                        <strong class="me-auto">系統通知</strong>
                        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                    <div class="toast-body">
                        ${message}
                    </div>
                </div>
            `;

  document.body.appendChild(toastContainer);
  const toast = new bootstrap.Toast(toastContainer.querySelector(".toast"));
  toast.show();

  // 自動移除 toast 元素
  toastContainer.addEventListener("hidden.bs.toast", function () {
    document.body.removeChild(toastContainer);
  });
}
// // 頁面加載後初始化
document.addEventListener("DOMContentLoaded", initializePage);

// Toastify({
//   text: "這是一個 Toast 訊息！",
//   duration: 3000, // 持續時間（毫秒）
//   position: "right", // 位置
//   backgroundColor: "#333", // 背景色
// }).showToast();

// // 搭配按鈕
// document.getElementById("showToast").addEventListener("click", function () {
//   Toastify({
//     text: "點擊成功！",
//     duration: 2000,
//   }).showToast();
// });
