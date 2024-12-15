import { Request, Response } from "express";
import { redisClient } from '@utils/redis'
import i18next from 'i18next';

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
  const data = JSON.stringify(req.body)
  await redisClient.set('language', data)
  await i18next.changeLanguage(req.body.language);
  req.flash("success", 'Successfully update language');
  res.redirect('/backoffice/')
}