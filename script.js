    const themes = {
      pink: { accent: '#ef8fa3', soft: '#fde7ed', dark: '#b44b63' },
      yellow: { accent: '#e8b94e', soft: '#fbf0cf', dark: '#9a741b' },
      blue: { accent: '#76a9d8', soft: '#e4eff8', dark: '#3f7199' },
      green: { accent: '#78b99a', soft: '#e2f1ea', dark: '#477c64' }
    };

    const saved = JSON.parse(localStorage.getItem('ritualHabit') || '{}');
    let habitName = saved.name || 'Beber agua';
    let theme = themes[saved.theme] ? saved.theme : 'pink';
    let completed = Array.isArray(saved.completed) ? saved.completed : [];
    let currentDate = new Date();

    const calendar = document.getElementById('calendar');
    const monthLabel = document.getElementById('monthLabel');
    const habitTitle = document.getElementById('habitTitle');
    const nameInput = document.getElementById('nameInput');
    const settingsPanel = document.getElementById('settingsPanel');
    const completeToday = document.getElementById('completeToday');

    function dateKey(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

    function save() {
      localStorage.setItem('ritualHabit', JSON.stringify({ name: habitName, theme, completed }));
    }

    function applyTheme() {
      const colors = themes[theme];
      document.documentElement.style.setProperty('--accent', colors.accent);
      document.documentElement.style.setProperty('--accent-soft', colors.soft);
      document.documentElement.style.setProperty('--accent-dark', colors.dark);
      document.querySelectorAll('.swatch').forEach(button => {
        button.classList.toggle('active', button.dataset.theme === theme);
      });
    }

    function render() {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const firstDay = new Date(year, month, 1);
      const mondayOffset = (firstDay.getDay() + 6) % 7;
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const todayKey = dateKey(new Date());

      monthLabel.textContent = firstDay.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
      calendar.innerHTML = '';

      for (let index = 0; index < mondayOffset; index++) {
        const spacer = document.createElement('div');
        spacer.className = 'day-spacer';
        calendar.appendChild(spacer);
      }

      for (let day = 1; day <= daysInMonth; day++) {
        const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const button = document.createElement('button');
        button.className = 'day';
        button.textContent = day;
        button.setAttribute('aria-label', `${day} ${monthLabel.textContent}${completed.includes(key) ? ', completado' : ''}`);
        button.classList.toggle('completed', completed.includes(key));
        button.classList.toggle('today', key === todayKey);
        button.addEventListener('click', () => toggleDay(key));
        calendar.appendChild(button);
      }

      const monthDaysCompleted = completed.filter(key => key.startsWith(`${year}-${String(month + 1).padStart(2, '0')}-`)).length;
      const percent = daysInMonth ? Math.round(monthDaysCompleted / daysInMonth * 100) : 0;
      document.getElementById('progressPercent').textContent = `${percent}%`;
      document.getElementById('progressCount').textContent = `${monthDaysCompleted} ${monthDaysCompleted === 1 ? 'día' : 'días'}`;
      document.getElementById('progressRing').style.setProperty('--progress', `${percent}%`);
      completeToday.classList.toggle('done', completed.includes(todayKey));
      completeToday.textContent = completed.includes(todayKey) ? 'Completado ✓' : 'Completado';
    }

    function toggleDay(key) {
      completed = completed.includes(key) ? completed.filter(item => item !== key) : [...completed, key];
      save();
      render();
    }

    document.getElementById('prevMonth').addEventListener('click', () => {
      currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
      render();
    });

    document.getElementById('nextMonth').addEventListener('click', () => {
      currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
      render();
    });

    completeToday.addEventListener('click', () => toggleDay(dateKey(new Date())));

    document.getElementById('settingsButton').addEventListener('click', () => {
      settingsPanel.classList.toggle('open');
    });

    nameInput.addEventListener('input', event => {
      habitName = event.target.value.trim() || 'Mi hábito';
      habitTitle.textContent = habitName;
      save();
    });

    document.querySelectorAll('.swatch').forEach(button => {
      button.addEventListener('click', () => {
        theme = button.dataset.theme;
        applyTheme();
        save();
      });
    });

    habitTitle.textContent = habitName;
    nameInput.value = habitName;
    applyTheme();
    render();
  
