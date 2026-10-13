import { Request, Response } from "express";
import { redisClient } from '@utils/redis'
import i18next from 'i18next';
import { logger, logFormatter } from "@utils/log";

export const index = async (req: Request, res: Response) => {
  const flashMessage = req.flash("success");
  const result = await redisClient.get('language')

  let language = ''

  if (result) {
    const languageSetting = JSON.parse(result)
    language = languageSetting.language
  }

  res.render("backoffice/language/index", {
    flashMessage,
    language
  });
}

export const store = async (req: Request, res: Response) => {
  try {
    const language = req.body.language

    await redisClient.set(
      'language',
      JSON.stringify({ language })
    );

    await i18next.changeLanguage(language);

    logger.info(
      logFormatter(
        'Language Setting Updated',
        { language },
        req.originalUrl
      )
    );

    req.flash('success', 'Successfully update language');
    res.redirect('/backoffice/');

  } catch (error) {
    logger.error(
      logFormatter(
        'Failed to Update Language Setting',
        {
          error: error instanceof Error
            ? error.message
            : String(error)
        },
        req.originalUrl
      )
    );

    res.status(500).send('Failed to update language setting');
  }

}