/**
 * FitTrack - Fitness Tracking Application
 * main.js - Core JavaScript functionality
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    initTheme();
    
    // Mobile menu toggle
    initSidebar();
    
    // Initialize any charts on the page
    initCharts();
    
    // Set event listeners
    setEventListeners();
});

/**
 * Initialize theme based on user preference or system setting
 */
function initTheme() {
    // Check localStorage first
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
        // Apply saved theme
        if (savedTheme === 'dark') {
            document.body.setAttribute('data-theme', 'dark');
            updateThemeIcons(true);
        } else {
            document.body.removeAttribute('data-theme');
            updateThemeIcons(false);
        }
    } else {
        // Check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.body.setAttribute('data-theme', 'dark');
            updateThemeIcons(true);
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.removeAttribute('data-theme');
            updateThemeIcons(false);
            localStorage.setItem('theme', 'light');
        }
    }
}

/**
 * Update theme toggle icons based on current theme
 */
function updateThemeIcons(isDark) {
    const themeIcons = document.querySelectorAll('.btn-theme-toggle i, .btn-theme-toggle-mobile i');
    
    themeIcons.forEach(icon => {
        if (isDark) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    });
}

/**
 * Initialize sidebar functionality for mobile
 */
function initSidebar() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const closeSidebar = document.getElementById('closeSidebar');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.add('show');
        });
    }
    
    if (closeSidebar && sidebar) {
        closeSidebar.addEventListener('click', () => {
            sidebar.classList.remove('show');
        });
    }
    
    // Close sidebar when clicking outside of it
    document.addEventListener('click', (e) => {
        const isClickInsideSidebar = sidebar.contains(e.target);
        const isClickOnMenuToggle = menuToggle.contains(e.target);
        
        if (sidebar.classList.contains('show') && !isClickInsideSidebar && !isClickOnMenuToggle) {
            sidebar.classList.remove('show');
        }
    });
}

/**
 * Set up event listeners
 */
function setEventListeners() {
    // Theme toggle buttons
    const themeToggles = document.querySelectorAll('.btn-theme-toggle, .btn-theme-toggle-mobile');
    
    themeToggles.forEach(button => {
        button.addEventListener('click', toggleTheme);
    });
    
    // Weekly calendar day buttons
    const dayButtons = document.querySelectorAll('.day-btn');
    
    dayButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            dayButtons.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
        });
    });
}

/**
 * Toggle between light and dark theme
 */
function toggleTheme() {
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    
    if (isDark) {
        document.body.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        updateThemeIcons(false);
    } else {
        document.body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        updateThemeIcons(true);
    }
    
    // Update any charts for better visibility in the new theme
    updateChartsForTheme();
}

/**
 * Initialize charts on the page if they exist
 * This function is called on page load
 */
function initCharts() {
    // Check if we're on a page with charts (e.g. Progress page)
    const weightChartEl = document.getElementById('weightChart');
    const workoutChartEl = document.getElementById('workoutChart');
    
    if (weightChartEl) {
        createWeightChart(weightChartEl);
    }
    
    if (workoutChartEl) {
        createWorkoutChart(workoutChartEl);
    }
}

/**
 * Update chart themes when toggling light/dark mode
 */
function updateChartsForTheme() {
    // Find all chart instances and update their theme options
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#e2e8f0' : '#718096';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    
    // Check if Chart.js is loaded and charts exist
    if (typeof Chart !== 'undefined' && Chart.instances) {
        Object.keys(Chart.instances).forEach(key => {
            const chart = Chart.instances[key];
            
            // Update chart options
            chart.options.scales.x.grid.color = gridColor;
            chart.options.scales.x.ticks.color = textColor;
            chart.options.scales.y.grid.color = gridColor;
            chart.options.scales.y.ticks.color = textColor;
            
            // Update the chart
            chart.update();
        });
    }
}

/**
 * Create weight tracking chart (for Progress page)
 */
function createWeightChart(canvas) {
    // Sample data for weight tracking
    const data = {
        labels: ['Mar 1', 'Mar 8', 'Mar 15', 'Mar 22', 'Mar 29', 'Apr 5', 'Apr 12', 'Apr 19'],
        datasets: [{
            label: 'Weight (kg)',
            data: [78, 77.5, 76.8, 76.2, 75.5, 75.8, 75.2, 75],
            fill: true,
            backgroundColor: 'rgba(67, 97, 238, 0.2)',
            borderColor: 'rgba(67, 97, 238, 1)',
            tension: 0.3,
            pointBackgroundColor: 'rgba(67, 97, 238, 1)',
            pointBorderColor: '#fff',
            pointRadius: 4
        }]
    };
    
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#e2e8f0' : '#718096';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    
    // Chart configuration
    const config = {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: isDark ? '#2d3748' : '#fff',
                    titleColor: isDark ? '#fff' : '#2d3748',
                    bodyColor: isDark ? '#e2e8f0' : '#718096',
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                    borderWidth: 1
                }
            },
            scales: {
                x: {
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        color: textColor
                    }
                },
                y: {
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        color: textColor
                    },
                    suggestedMin: 70
                }
            }
        }
    };
    
    // Create chart
    if (typeof Chart !== 'undefined') {
        new Chart(canvas, config);
    }
}

/**
 * Create workout tracking chart (for Progress page)
 */
function createWorkoutChart(canvas) {
    // Sample data for workout tracking
    const data = {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [{
            label: 'Workout Duration (min)',
            data: [120, 150, 180, 210],
            backgroundColor: 'rgba(67, 97, 238, 0.8)',
            borderRadius: 4
        }]
    };
    
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#e2e8f0' : '#718096';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    
    // Chart configuration
    const config = {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: isDark ? '#2d3748' : '#fff',
                    titleColor: isDark ? '#fff' : '#2d3748',
                    bodyColor: isDark ? '#e2e8f0' : '#718096',
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                    borderWidth: 1
                }
            },
            scales: {
                x: {
                    grid: {
                        color: gridColor,
                        display: false
                    },
                    ticks: {
                        color: textColor
                    }
                },
                y: {
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        color: textColor
                    }
                }
            }
        }
    };
    
    // Create chart
    if (typeof Chart !== 'undefined') {
        new Chart(canvas, config);
    }
}

/**
 * Simulate AJAX request (for demo purposes)
 * In a real application, this would be replaced with actual API calls
 */
function fetchData(endpoint, callback) {
    // Simulate network delay
    setTimeout(() => {
        let data;
        
        // Return mock data based on the endpoint
        switch (endpoint) {
            case '/api/workout-plans':
                data = [
                    { id: 1, name: 'Full Body Strength', level: 'Intermediate', weeks: 8 },
                    { id: 2, name: 'Weight Loss Challenge', level: 'Beginner', weeks: 12 },
                    { id: 3, name: 'Muscle Building', level: 'Advanced', weeks: 10 }
                ];
                break;
                
            case '/api/workout-logs':
                data = [
                    { id: 1, name: 'Full Body Workout', date: '2025-04-22', duration: 50 },
                    { id: 2, name: 'Upper Body Focus', date: '2025-04-20', duration: 35 },
                    { id: 3, name: 'HIIT Session', date: '2025-04-18', duration: 25 }
                ];
                break;
                
            default:
                data = null;
        }
        
        callback(data);
    }, 300);
}

/**
 * Login form validation (for login.html)
 */
function validateLoginForm(event) {
    if (event) event.preventDefault();
    
    const form = document.getElementById('loginForm');
    
    if (!form) return false;
    
    const username = form.querySelector('#username').value.trim();
    const password = form.querySelector('#password').value.trim();
    const errorMsg = form.querySelector('.error-message');
    
    // Reset error message
    if (errorMsg) {
        errorMsg.textContent = '';
        errorMsg.style.display = 'none';
    }
    
    // Validate form
    if (!username) {
        if (errorMsg) {
            errorMsg.textContent = 'Please enter your username';
            errorMsg.style.display = 'block';
        }
        return false;
    }
    
    if (!password) {
        if (errorMsg) {
            errorMsg.textContent = 'Please enter your password';
            errorMsg.style.display = 'block';
        }
        return false;
    }
    
    // In a real application, you would make an API call here
    // For demo purposes, we'll just redirect to the dashboard
    window.location.href = 'index.html';
    return false;
}

/**
 * Registration form validation (for register.html)
 */
function validateRegisterForm(event) {
    if (event) event.preventDefault();
    
    const form = document.getElementById('registerForm');
    
    if (!form) return false;
    
    const username = form.querySelector('#username').value.trim();
    const email = form.querySelector('#email').value.trim();
    const password = form.querySelector('#password').value.trim();
    const confirmPassword = form.querySelector('#confirmPassword').value.trim();
    const errorMsg = form.querySelector('.error-message');
    
    // Reset error message
    if (errorMsg) {
        errorMsg.textContent = '';
        errorMsg.style.display = 'none';
    }
    
    // Validate form
    if (!username) {
        if (errorMsg) {
            errorMsg.textContent = 'Please enter a username';
            errorMsg.style.display = 'block';
        }
        return false;
    }
    
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        if (errorMsg) {
            errorMsg.textContent = 'Please enter a valid email address';
            errorMsg.style.display = 'block';
        }
        return false;
    }
    
    if (!password || password.length < 8) {
        if (errorMsg) {
            errorMsg.textContent = 'Password must be at least 8 characters';
            errorMsg.style.display = 'block';
        }
        return false;
    }
    
    if (password !== confirmPassword) {
        if (errorMsg) {
            errorMsg.textContent = 'Passwords do not match';
            errorMsg.style.display = 'block';
        }
        return false;
    }
    
    // In a real application, you would make an API call here
    // For demo purposes, we'll just redirect to the dashboard
    window.location.href = 'index.html';
    return false;
}
// Function to search foods
async function searchFoods(query) {
    if (query.length < 2) return [];
    
    try {
      const response = await fetch(`/api/foods/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        console.error("Error searching foods:", data.message);
        return [];
      }
    } catch (error) {
      console.error("Failed to search foods:", error);
      return [];
    }
  }
  
  // Function to log a food
  async function logFood(foodId, amount, mealTypeId, date) {
    try {
      const response = await fetch('/api/food-logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          foodId,
          amount,
          mealTypeId,
          date: date || new Date().toISOString().split('T')[0]
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Update UI to show the new food log
        return data.data;
      } else {
        console.error("Error logging food:", data.message);
        return null;
      }
    } catch (error) {
      console.error("Failed to log food:", error);
      return null;
    }
  }
  
  // Function to get food logs for a date
  async function getFoodLogs(date) {
    try {
      const response = await fetch(`/api/food-logs?date=${date}`);
      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        console.error("Error getting food logs:", data.message);
        return [];
      }
    } catch (error) {
      console.error("Failed to get food logs:", error);
      return [];
    }
  }
//Date today
const today = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  document.getElementById("dateToday").textContent = today.toLocaleDateString('en-US', options);


const greetingSpan = document.getElementById("greeting");
const currentHour = new Date().getHours();
  let greeting;

  if (currentHour < 12) {
    greeting = "morning";
  } else if (currentHour < 18) {
    greeting = "afternoon";
  } else {
    greeting = "evening";
  }

  greetingSpan.textContent = greeting;