import { test, expect } from '@playwright/test';

const bunId = '643d69a5c3f7b9001cfa093c';
const mainId = '643d69a5c3f7b9001cfa0941';
const sauceId = '643d69a5c3f7b9001cfa0942';

test.describe('Конструктор бургера', () => {
    test.beforeEach(async ({ page, context }) => {
        // 1. Перехват запросов через HAR файл
        await page.routeFromHAR('./tests/hars/burger-constructor.har', {
            update: false,
            url: 'https://norma.education-services.ru/api/**'
        });

        // 2. Добавляем фейковые токены для авторизации
        await context.addCookies([
            {
                name: 'accessToken',
                value: 'Bearer test-access-token',
                url: 'http://localhost:4000'
            }
        ]);

        await page.addInitScript(() => {
            window.localStorage.setItem('refreshToken', 'test-refresh-token');
        });

        // 3. Переходим на главную страницу
        await page.goto('/');

        // 4. Загрузки ингредиентов
        await page.waitForSelector(`[data-testid="ingredient-${bunId}"]`, { timeout: 10000 });
    });

    test.afterEach(async ({ page, context }) => {
        // Очистка после тестов
        await page.evaluate(() => window.localStorage.clear());
        await context.clearCookies();
    });

    test('Добавление ингредиентов в конструктор', async ({page}) => {
        await expect(page.getByText('Соберите бургер')).toBeVisible();

        await expect(page.getByTestId('constructor-empty-bun-top')).toBeVisible();
        await expect(page.getByTestId('constructor-empty-filling')).toBeVisible();
        await expect(page.getByTestId('constructor-empty-bun-bottom')).toBeVisible();

        await page.getByTestId(`add-ingredient-${bunId}`).locator('button').click();
        await page.getByTestId(`add-ingredient-${mainId}`).locator('button').click();
        await page.getByTestId(`add-ingredient-${sauceId}`).locator('button').click();

        await expect(page.getByTestId('constructor-bun-top')).toContainText('Краторная булка N-200i (верх)');
        await expect(page.getByTestId('constructor-bun-bottom')).toContainText('Краторная булка N-200i (низ)');
        await expect(page.getByTestId('burger-constructor')).toContainText('Биокотлета из марсианской Магнолии');
        await expect(page.getByTestId('burger-constructor')).toContainText('Соус Spicy-X');

        await expect(page.getByTestId('constructor-empty-bun-top')).not.toBeVisible();
        await expect(page.getByTestId('constructor-empty-filling')).not.toBeVisible();
        await expect(page.getByTestId('constructor-empty-bun-bottom')).not.toBeVisible();
    })

    test('Открытие и закрытие модального окна ингредиента', async ({ page }) => {
        await page.getByTestId(`ingredient-${mainId}`).locator('a').click();

        const modal = page.getByTestId('modal');
        await expect(modal).toBeVisible();

        await expect(modal).toContainText('Биокотлета из марсианской Магнолии');
        await expect(modal).toContainText('4242'); // Калории
        await expect(modal).toContainText('420');  // Белки
        await expect(modal).toContainText('142');  // Жиры
        await expect(modal).toContainText('242');  // Углеводы

        await page.getByTestId('modal-close-button').click();
        await expect(modal).not.toBeVisible();

        await page.getByTestId(`ingredient-${sauceId}`).locator('a').click();
        await expect(modal).toBeVisible();
        await expect(modal).toContainText('Соус Spicy-X');

        await page.getByTestId('modal-overlay').click({
            position: {
                x: 10,
                y: 10
            }
        });
        await expect(page.getByTestId('modal')).not.toBeVisible();
    })

    test('Cоздание заказа и очистка конструктора', async ({ page }) => {
        await expect(page.getByTestId('modal')).not.toBeVisible();

        await page.getByTestId(`add-ingredient-${bunId}`).locator('button').click();
        await page.waitForTimeout(300);

        await page.getByTestId(`add-ingredient-${mainId}`).locator('button').click();
        await page.waitForTimeout(300);

        await page.getByTestId(`add-ingredient-${sauceId}`).locator('button').click();
        await page.waitForTimeout(300);
   
        const constructor = page.getByTestId('burger-constructor');

        await expect(constructor).toContainText('Краторная булка N-200i (верх)');
        await expect(constructor).toContainText('Биокотлета из марсианской Магнолии');
        await expect(constructor).toContainText('Соус Spicy-X');
        await expect(constructor).toContainText('Краторная булка N-200i (низ)');

        await page.getByTestId('order-button').click();

        const modal = page.getByTestId('modal');
        await expect(modal).toBeVisible();
        await expect(modal).toContainText('54321');
        await expect(modal).toContainText('идентификатор заказа');
        await expect(modal).toContainText('Ваш заказ начали готовить');

        await page.getByTestId('modal-close-button').click();

        await expect(page.getByTestId('modal')).not.toBeVisible();

        await expect(page.getByTestId('constructor-empty-bun-top')).toBeVisible();
        await expect(page.getByTestId('constructor-empty-filling')).toBeVisible();
        await expect(page.getByTestId('constructor-empty-bun-bottom')).toBeVisible();
    })
})