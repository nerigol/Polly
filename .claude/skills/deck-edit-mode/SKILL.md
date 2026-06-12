# Skill: deck-edit-mode

## מטרה
הוספת מצב עריכה חזותי (in-place) לכל קובץ HTML של מצגת/אתר.
הסקיל מזריק סרגל כלים + מנוע עריכה שמאפשרים ללחוץ על טקסט ולערוך אותו ישירות בדפדפן, ולשמור את התוצאה כקובץ HTML חדש.

## קבצים
| קובץ | תפקיד |
|------|--------|
| `scripts/editor.js`  | מנוע עריכה (vanilla JS, ללא תלויות) |
| `scripts/editor.css` | עיצוב סרגל הכלים ומצבי hover/active |
| `scripts/inject_editor.py` | מזריק / מסיר את העורך מקובץ HTML |

## שימוש

### הזרקה
```bash
python .claude/skills/deck-edit-mode/scripts/inject_editor.py <קובץ.html>
```

### הסרה
```bash
python .claude/skills/deck-edit-mode/scripts/inject_editor.py <קובץ.html> --remove
```

## מה המשתמש יראה
- כפתור **✏️ עריכה** צף בפינה השמאלית התחתונה של הדף.
- לחיצה עליו מפעילה מצב עריכה: כל אלמנט טקסטואלי מסתמן בהובר ירוק מקוקוו.
- לחיצה על אלמנט הופכת אותו ל-`contenteditable` — ניתן לערוך ישירות.
- סרגל הכלים בחלק העליון מאפשר: **Bold / Italic / Underline / Strike**, יישור, צבע טקסט.
- לחצן **💾 שמור** מוריד את הדף המעודכן כ-HTML נקי (ללא עקבות העורך).
- לחצן **✕ יציאה** מסיר את מצב העריכה.

## הנחיות לקלוד
1. כשמשתמש מבקש "הוסף מצב עריכה" / "edit mode" / "עריכה חזותית" לקובץ HTML:
   - הרץ `inject_editor.py <קובץ>`.
2. כשמשתמש מבקש להסיר:
   - הרץ `inject_editor.py <קובץ> --remove`.
3. אחרי הזרקה — עשה commit + push לענף הפעיל.
