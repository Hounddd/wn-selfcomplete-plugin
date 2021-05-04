# Self complete formwidget

A "text" formwidget which, like a "dropdown" field, offers options based on existing DB values.

![Formwidget Selfcomplete in action](https://github.com/hounddd/wn-selfcomplete-plugin/blob/master/docs/assets/Selfcomplete.gif?raw=true)

## Why this formwidget

Simple **text** fields let only enter new values, while **dropdown** ones let only select between values.

This field will act as a text entry letting you enter any value consistent with the field, but at the same time will provide you with the previous unique values for that same field.
In this way it is possible to see the values already present in the database and to avoid duplicates due to different entries by different users.
**It is still possible to enter whatever you want in the field.**


## How to use
The plugin register a new form field type : `selfcomplete`.
You can use it in your [backend fields definition](https://wintercms.com/docs/backend/forms#form-fields).

```
city:
    label: City SelfComplete
    type: selfcomplete
    modelClass: \Winter\Test\Models\City
    # table: 'winter_test_cities'
    selectFrom: name
```
### Options
None of these are required, if omited the form widget will use the current controller class and field name.
 - **modelClass**: Model class name to use.
 - **table**: Table name to use.
 - **selectFrom**: Field name to use.

*Be careful when using it, this form widget has not been tested with other than text fields.*
