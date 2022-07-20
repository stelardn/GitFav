import { GitHubUser } from "./GitHubUser.js";

//logica
export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root);

    this.load();

    this.add("stelardn");
  }

  load() {
    this.entries = [
      {
        login: "stelardn",
        name: "Stéfany",
        public_reps: "22",
        followers: "32",
      },
      {
        login: "diego3g",
        name: "Diego",
        public_reps: "22",
        followers: "32",
      },
    ]

  }

  async add(user) {
    let newEntries = [];
    const newUser = await GitHubUser.search(user);
    
    newEntries = [newUser, ...this.entries];

    this.entries = newEntries;

    console.log(this.entries);

  }

  delete(user) {
    let newEntries = [];
    this.entries.forEach(entry => {
      if (entry.login !== user) {
        newEntries = [...newEntries, entry]
      }
    })

    this.entries = newEntries;
    console.log(this.entries);
  }

}

//html

export class FavoritesView extends Favorites {
  constructor(root) {
    super(root);

    this.tbody = this.root.querySelector("table tbody");

    this.update();

    // this.delete("stelardn");

  }

  update() {
    this.removeAllRows();

    this.createRows();
  }

  removeAllRows() {
    this.tbody.querySelectorAll("tr")
    .forEach(
      (row) => {
        row.remove();
        // emptyState();
      }
    )
  }

  createRows() {
    if (this.entries[0]) {
      this.entries.forEach(entry => 
      {
        const row = this.createARow();

        row.querySelector('.user a').href = `https://github.com/${entry.login}`
        row.querySelector('.user img').alt = `Imagem de ${entry.name}` 
        row.querySelector('.user img').src = `https://github.com/${entry.login}.png` 
        row.querySelector('.user a p').innerHTML = `${entry.name}<br/>
        <span>/${entry.login}</span>`
        row.querySelector('.repos').textContent = entry.public_reps;
        row.querySelector('.followers').textContent = entry.followers;

        this.tbody.append(row);

        row.querySelector('.action button').onclick = () => {
          this.delete(entry.login);
          this.update();
        }
      })
    } else {
      const emptySpace = this.createEmptyTable();
      console.log(emptySpace);
      this.tbody.append(emptySpace);
    }

  }

  createARow() {
    const tr = document.createElement("tr");

    tr.innerHTML = `
            <td class="user">
              <a href="https://github.com/user" target="_blank">
                <img alt="Imagem de name" src="https://github.com/stelardn.png">
                <p>Name<br/>
                  <span>/login</span>
                </p>
              </a>
            </td>
            <td class="repos">0</td>
            <td class="followers">0</td>
            <td class="action">
              <button>
                Remover
              </button>
            </td>
    `
    return tr;
  }

  createEmptyTable() {
    const tr = document.createElement('tr');

    tr.innerHTML = `
    <td colspan="4" class="empty-state">
     <div id="empty-state">
        <img src="img/star-empty.svg" alt="Desenho de uma estrela com uma expressão humana de surpresa.">
        <p>Nenhum favorito ainda</p>
      </div>
    </td>`

    return tr;
  }

}