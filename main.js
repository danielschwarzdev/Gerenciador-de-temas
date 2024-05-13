// Faz a requisição e armazena o JSON em localStorage
function storeJSONInLocalStorage() {
  const themesFile = "./themes.json";

  fetch(themesFile)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch JSON");
      }
      return response.json();
    })
    .then((json) => {
      localStorage.setItem("themes", JSON.stringify(json));
    })
    .catch((error) => {
      console.error(error);
    });
}

// Atualiza as cores do tema
function updateThemeColors(primaryColor, secondaryColor, successColor, dangerColor, warningColor) {
  document.body.style.setProperty("--primary-color", primaryColor);
  document.body.style.setProperty("--secondary-color", secondaryColor);
  document.body.style.setProperty("--success-color", successColor);
  document.body.style.setProperty("--danger-color", dangerColor);
  document.body.style.setProperty("--warning-color", warningColor);
}

// Preenche a lista com os temas existentes
function populateList(themes) {
  if (themes) {
    const themeList = document.getElementById("themes-list");
    let themeListHTML = "";

    themes.forEach((theme) => {
      themeListHTML += `
        <li>
          <a href="#" class="themes-list__item dropdown-item d-flex align-items-center gap-2 py-2" data-name="${theme.name}" data-primary-color="${theme.colors.primary}" data-secondary-color="${theme.colors.secondary}" data-success-color="${theme.colors.success}" data-danger-color="${theme.colors.danger}" data-warning-color="${theme.colors.warning}">
            <span class="d-inline-block rounded-circle p-1" style="background-color: ${theme.colors.primary}"></span>
            ${theme.name}
          </a>
        </li>
      `;
    });

    themeList.innerHTML = themeListHTML;
  }
}

// Filtra a lista preenchida anteriormente
function filterList() {
  const themeFilter = document.getElementById("theme-filter");
  themeFilter.addEventListener("input", () => {
    const searchText = themeFilter.value.toLowerCase();
    const themeItems = document.querySelectorAll("#themes-list li");

    // Iterar sobre os itens da lista
    themeItems.forEach((themeItem) => {
      const themeName = themeItem.textContent.toLowerCase();

      // Verificar se o texto do item da lista contém o texto digitado
      if (themeName.includes(searchText)) {
        themeItem.style.display = "block";
      } else {
        themeItem.style.display = "none";
      }
    });
  });
}

// Preenche a lacuna do hero com o nome do tema
function setThemeName(name) {
  const colorName = document.getElementById("theme-name");
  colorName.innerHTML = name;
}

// Altera o tema
function changeTheme() {
  const themeListItem = document.querySelectorAll(".themes-list__item");

  themeListItem.forEach((item) => {
    item.addEventListener("click", (event) => {
      event.preventDefault();

      const name = event.target.getAttribute("data-name");
      const primaryColor = event.target.getAttribute("data-primary-color");
      const secondaryColor = event.target.getAttribute("data-secondary-color");
      const successColor = event.target.getAttribute("data-success-color");
      const dangerColor = event.target.getAttribute("data-danger-color");
      const warningColor = event.target.getAttribute("data-warning-color");

      updateThemeColors(primaryColor, secondaryColor, successColor, dangerColor, warningColor);
      setThemeName(name);
    });
  });
}

// Preenche a tabela com os temas existentes
function populateTable(themes) {
  if (themes) {
    const themeTable = document.getElementById("themes-table");
    let themeTableHTML = "";

    themes.forEach((theme) => {
      themeTableHTML += `
      <tr>
        <th scope="row">${theme.id}</th>
        <td>${theme.name}</td>
        <td>${theme.colors.primary}</td>
        <td>${theme.colors.secondary}</td>
        <td>${theme.colors.success}</td>
        <td>${theme.colors.danger}</td>
        <td>${theme.colors.warning}</td>
        <td class="text-end">
          <a href="javascript:;" onclick="openModal('edit', ${theme.id})"><i class="bx bx-edit"></i></a>
          <a href="javascript:;" onclick="deleteItem(${theme.id})"><i class="bx bx-trash"></i></a>
        </td>
      </tr>
      `;
    });

    themeTable.innerHTML = themeTableHTML;
  }
}

// Modal
function openModal(action, index = 0) {
  // Limpa os valores dos inputs e abre modal
  const inputs = document.querySelectorAll("#modal input");
  inputs.forEach((input) => (input.value = ""));

  const modal = document.getElementById("modal");
  const modalInit = new bootstrap.Modal(modal);
  modalInit.show();

  // Atribui inputs a variaveis e os popula caso a ação for de edição
  const nome = document.querySelector("#nome");
  const primaria = document.querySelector("#cor-primaria");
  const secundaria = document.querySelector("#cor-secundaria");
  const sucesso = document.querySelector("#cor-sucesso");
  const erro = document.querySelector("#cor-erro");
  const alerta = document.querySelector("#cor-alerta");

  if (action == "edit") {
    const theme = themes.find((item) => item.id === index);
    if (theme) {
      nome.value = theme.name;
      primaria.value = theme.colors.primary;
      secundaria.value = theme.colors.secondary;
      sucesso.value = theme.colors.success;
      erro.value = theme.colors.danger;
      alerta.value = theme.colors.warning;
    }
  }

  // Envia o formulário
  const formTheme = document.getElementById("form-theme");
  formTheme.addEventListener(
    "submit",
    (event) => {
      event.preventDefault();

      if (action == "add") {
        addTheme(nome.value, primaria.value, secundaria.value, sucesso.value, erro.value, alerta.value);
        modalInit.hide();
      } else if (action == "edit") {
        editTheme(
          index,
          nome.value,
          primaria.value,
          secundaria.value,
          sucesso.value,
          erro.value,
          alerta.value
        );
        modalInit.hide();
      }
    },
    { once: true }
  );
}

// Adiciona tema
function addTheme(nome, primaria, secundaria, sucesso, erro, alerta) {
  if (themes) {
    if (nome.value == "") {
      return;
    }

    const newId = Math.max(...themes.map((tema) => tema.id));
    const newTheme = {
      id: newId + 1,
      name: nome,
      colors: {
        primary: primaria,
        secondary: secundaria,
        success: sucesso,
        danger: erro,
        warning: alerta,
      },
    };

    themes.push(newTheme);
    localStorage.setItem("themes", JSON.stringify(themes));
    populateList(themes);
    populateTable(themes);
    changeTheme();
  }
}

// Edita tema
function editTheme(index, nome, primaria, secundaria, sucesso, erro, alerta) {
  if (themes) {
    if (nome.value == "") {
      return;
    }

    const findIndex = themes.findIndex((item) => item.id === index);
    if (findIndex !== -1) {
      const newTheme = {
        id: index,
        name: nome,
        colors: {
          primary: primaria,
          secondary: secundaria,
          success: sucesso,
          danger: erro,
          warning: alerta,
        },
      };

      themes[findIndex] = newTheme;
      localStorage.setItem("themes", JSON.stringify(themes));
      populateList(themes);
      populateTable(themes);
      changeTheme();
    }
  }
}

// Deleta tema
function deleteItem(index) {
  const indexToRemove = themes.findIndex((theme) => theme.id === index);

  if (indexToRemove !== -1) {
    themes.splice(indexToRemove, 1);
  }

  localStorage.setItem("themes", JSON.stringify(themes));
  populateList(themes);
  populateTable(themes);
  changeTheme();
}

// Inicializa as funções
const themes = JSON.parse(localStorage.getItem("themes"));
if (!themes) {
  storeJSONInLocalStorage();
}

if (themes[0]) {
  updateThemeColors(
    themes[0].colors.primary,
    themes[0].colors.secondary,
    themes[0].colors.success,
    themes[0].colors.danger,
    themes[0].colors.warning
  );

  setThemeName(themes[0].name);
}

populateList(themes);
filterList();
changeTheme();
populateTable(themes);
