import i18next from 'i18next';
import Backend from 'i18next-fs-backend'
import i18nextMiddleware from 'i18next-http-middleware';
import path from "path";

const language = () => {
    i18next
        .use(Backend)
        .use(i18nextMiddleware.LanguageDetector)
        .init({
            fallbackLng: 'en',
            preload: ['en', 'id'],
            backend: {
                loadPath: path.resolve(__dirname, '../locales/{{lng}}/translation.json')
            },
            detection: {
                order: ['querystring', 'cookie', 'header'],
                caches: ['cookie'],
            }
        })

    return i18nextMiddleware.handle(i18next)
}

export default language