document.addEventListener('DOMContentLoaded', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'analyzeItemprops' }, (response) => {
            const resultDiv = document.getElementById('result');

            if (response.type === 'unsupported') {
                resultDiv.innerHTML = `<p>${response.message}</p>`;
            } else {
                resultDiv.innerHTML = `
            <h2>Анализ страницы: ${response.pageType}</h2>
            <h3>Найденные itemprop:</h3>
            <ul>${response.foundItems.map(item => `<li class="found">✅ ${item}</li>`).join('')}</ul>
            ${response.hiddenItems.length ? `
              <h3>Скрытые itemprop:</h3>
              <ul>${response.hiddenItems.map(item => `<li class="hidden">🔸 ${item}</li>`).join('')}</ul>
            ` : ''}
            ${response.missingItems.length ? `
              <h3>Отсутствующие itemprop:</h3>
              <ul>${response.missingItems.map(item => `<li class="missing">❌ ${item}</li>`).join('')}</ul>
            ` : ''}
            <p>Итого: ${response.foundItems.length} найдено, ${response.hiddenItems.length} скрыто, ${response.missingItems.length} отсутствует</p>
          `;
            }
        });
    });
});