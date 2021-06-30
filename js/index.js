// элементы в DOM можно получить при помощи функции querySelector
const fruitsList = document.querySelector('.fruits__list'); // список карточек
const shuffleButton = document.querySelector('.shuffle__btn'); // кнопка перемешивания
const filterButton = document.querySelector('.filter__btn'); // кнопка фильтрации
const sortKindLabel = document.querySelector('.sort__kind'); // поле с названием сортировки
const sortTimeLabel = document.querySelector('.sort__time'); // поле с временем сортировки
const sortChangeButton = document.querySelector('.sort__change__btn'); // кнопка смены сортировки
const sortActionButton = document.querySelector('.sort__action__btn'); // кнопка сортировки
const kindInput = document.querySelector('.kind__input'); // поле с названием вида
const colorInput = document.querySelector('.color__input'); // поле с названием цвета
const weightInput = document.querySelector('.weight__input'); // поле с весом
const addActionButton = document.querySelector('.add__action__btn'); // кнопка добавления
const MinWeight = document.querySelector('.minweight__input');// поле ввода минимального веса
const MaxWeight = document.querySelector('.maxweight__input');// поле ввода максимального веса
//установка таких же размеров поля input для цвета, как и у поля input для текста.
colorInput.style.height = kindInput.clientHeight + "px";
colorInput.style.width = kindInput.clientWidth + "px";
function HEXtoBright(hex)
{
 return (parseInt(hex.substring(1, 2),16) + parseInt(hex.substring(3, 4),16) + parseInt(hex.substring(5, 6),16));
}
// список фруктов в JSON формате
let fruitsJSON = `[
  {"kind": "Мангустин", "color": "#8b00ff", "weight": 13},
  {"kind": "Дуриан", "color": "#84cd1b", "weight": 35},
  {"kind": "Личи", "color": "#dc143c", "weight": 17},
  {"kind": "Карамбола", "color": "#ffd800", "weight": 28},
  {"kind": "Тамаринд", "color": "#cd853f", "weight": 22}
]`;

// преобразование JSON в объект JavaScript
let fruits = JSON.parse(fruitsJSON);

/*** ОТОБРАЖЕНИЕ ***/

// отрисовка карточек
const display = () => 
{
  fruitsList.innerHTML = '';
  // чтобы заполнить актуальными данными из fruits

  for (let i = 0; i < fruits.length; i++) {
    let li = document.createElement("li");
    let di = document.createElement("div");
    let di1 = document.createElement("div");
    let di2 = document.createElement("div");
    let di3 = document.createElement("div");
    let di4 = document.createElement("div");
    di1.textContent = `index: ${i}`;
    di2.textContent = `kind: ${fruits[i].kind}`;
    di3.textContent = `color: ${fruits[i].color}`;
    di4.textContent = `weight: ${fruits[i].weight}`;
    li.appendChild(di);
    di.appendChild(di1);
    di.appendChild(di2);
    di.appendChild(di3);
    di.appendChild(di4);
    li.className = "fruit__item";
    li.style.background = fruits[i].color;
    di.className = "fruit__info";
    fruitsList.appendChild(li);
  }
};

// первая отрисовка карточек
display();

/*** ПЕРЕМЕШИВАНИЕ ***/

// генерация случайного числа в заданном диапазоне
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// перемешивание массива
const shuffleFruits = () => {
  let result = [];
  while (fruits.length > 0) 
  {
    result.push(fruits.splice(getRandomInt(0, fruits.length - 1), 1)[0]);
  }
  fruits = result;
};

shuffleButton.addEventListener('click', () => {
  shuffleFruits();
  display();
});

/*** ФИЛЬТРАЦИЯ ***/

// фильтрация массива
const filterFruits = () => {
    for (i = 0;i < fruits.length;i++) 
    {
      if (fruits[i].weight > MaxWeight.value || fruits[i].weight < MinWeight.value)
      {
        fruits.splice(i, 1);
      }
    }
};

filterButton.addEventListener('click', () => {
  filterFruits();
  display();
});

/*** СОРТИРОВКА ***/

let sortKind = 'bubbleSort'; // инициализация состояния вида сортировки
let sortTime = '-'; // инициализация состояния времени сортировки

const comparationColor = (a, b) => {
  brightA = HEXtoBright(a);
  brightB = HEXtoBright(b);
  if(brightA <= brightB) 
  {
    return true;
  }
  else
  {
    return false;
  }
};

const sortAPI = {
  bubbleSort(arr, comparation) {
    let score = 1;
    let store;
    while (score > 0)
    {
      score = 0;
      for(i = 0;i < arr.length - 1; i++)
      {
        if(!comparation(arr[i+1].color, arr[i].color)) 
        {
          store = arr[i+1];
          arr[i+1] = arr[i];
          arr[i] = store;
          score += 1;
        }
      }
    }
    return arr;
  },

  quickSort(arr, comparation) {
    if (arr.length < 2) {
      return arr;
    } 
    else 
    {
    let less = [];
		let greater = [];
    const pivotPosition = Math.floor(Math.random() * arr.length);
    const pivot = arr[pivotPosition];
		for (let i = 0; i < arr.length; i++) 
    {
      const isPivot = i === pivotPosition;
      if(HEXtoBright(arr[i].color) <= HEXtoBright(pivot.color) && !isPivot) 
      {
        less.push(arr[i])
      } else if (HEXtoBright(arr[i].color) > HEXtoBright(pivot.color)) 
      {
        greater.push(arr[i]);
      }
    }
    return [ ...sortAPI.quickSort(greater), pivot, ...sortAPI.quickSort(less)];
  }
  },

  // выполняет сортировку и производит замер времени
  startSort(sort, arr, comparation) {
    const start = new Date().getTime();
    arr = sort(arr, comparation);
    const end = new Date().getTime();
    sortTime = `${end - start} ms`;
    return arr;
  },
};

// инициализация полей
sortKindLabel.textContent = sortKind;
sortTimeLabel.textContent = sortTime;

sortChangeButton.addEventListener('click', () => {
  if (sortKind == 'bubbleSort')
  {
    sortKind = 'quickSort';
    sortKindLabel.textContent = sortKind;
  }
  else
  {
    sortKind = 'bubbleSort';
    sortKindLabel.textContent = sortKind;
  }
});

sortActionButton.addEventListener('click', () => {
  sortTimeLabel.textContent = 'sorting...'
  const sort = sortAPI[sortKind];
  fruits = sortAPI.startSort(sort, fruits, comparationColor);
  display();
  sortTimeLabel.textContent = sortTime;
});

/*** ДОБАВИТЬ ФРУКТ ***/

addActionButton.addEventListener('click', () => {
  fruits.push({kind: kindInput.value, color: colorInput.value, weight: parseInt(weightInput.value)});
  display();
});
