<?php namespace Hounddd\SelfComplete\FormWidgets;

use Db;
use Schema;
use Backend\Classes\FormWidgetBase;

/**
 * Selfcomplete Form Widget
 */
class Selfcomplete extends FormWidgetBase
{
    /*
     * Config attributes
     */
    protected $table      = null;
    protected $modelClass = null;
    protected $selectFrom = null;
    protected $pattern    = 'text';

    /**
     * @inheritDoc
     */
    protected $defaultAlias = 'selfcomplete';

    /**
     * @inheritDoc
     */
    public function init()
    {
        $this->fillFromConfig([
            'table',
            'modelClass',
            'selectFrom',
            'pattern'
        ]);

        if (!isset($this->table) && !isset($this->modelClass)) {
            $this->modelClass = get_class($this->model);
        } else {
            if (isset($this->table)) {
                $this->assertTable();
            }
            if (isset($this->modelClass)) {
                $this->assertModelClass();
            };
        };

        if ($this->selectFrom == null) {
            $this->selectFrom = $this->formField->fieldName;
        };

        parent::init();
    }

    /**
     * @inheritDoc
     */
    public function render()
    {
        $this->prepareVars();
        return $this->makePartial('Selfcomplete');
    }

    /**
     * Prepares the form widget view data
     */
    public function prepareVars()
    {
        $this->vars['inputType'] = $this->pattern;
        $this->vars['name']      = $this->formField->getName();
        $this->vars['table']     = $this->table;
        $this->vars['model']     = $this->model;
        $this->vars['value']     = $this->getLoadValue();
    }

    /**
     * @inheritDoc
     */
    public function loadAssets()
    {
        $this->addCss('css/selfcomplete.css', 'Hounddd.SelfComplete');
        $this->addJs('js/selfcomplete.js', 'Hounddd.SelfComplete');
    }

    /**
     * @inheritDoc
     */
    public function getSaveValue($value)
    {
        return $value;
    }

    /**
     * Return the matching values
     *
     * @return array
     */
    public function getList()
    {
        $modelRecords = [];

        if (!$this->modelClass) {
            if ($this->table) {
                $modelRecords = Db::table($this->table)->select($this->selectFrom)->distinct()->get();
            }
        } else {
            $model = new $this->modelClass;
            $modelRecords = $model->newQuery()->select($this->selectFrom)->distinct()->get();
        }


        return $modelRecords->pluck($this->selectFrom);
    }


    protected function assertTable()
    {
        if (!isset($this->table) || !Schema::hasTable($this->table)) {
            throw new \InvalidArgumentException(sprintf("Schema table {%s} not found.", $this->table));
        }
    }

    protected function assertModelClass()
    {
        if (!isset($this->modelClass) || !class_exists($this->modelClass)) {
            throw new \InvalidArgumentException(sprintf("Model class {%s} not found.", $this->modelClass));
        }
    }
}
