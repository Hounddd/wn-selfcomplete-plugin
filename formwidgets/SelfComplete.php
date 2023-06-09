<?php namespace Hounddd\SelfComplete\FormWidgets;

use Db;
use Schema;
use Backend\Classes\FormWidgetBase;
use Illuminate\Support\Arr;

/**
 * Selfcomplete Form Widget
 */
class Selfcomplete extends FormWidgetBase
{
    /*
     * Config attributes
     */

    /**
     * Table name used to perform request
     */
    protected ?string $table      = null;

    /**
     * Model class used to perform request
     */
    protected ?string $modelClass = null;

    /**
     * Field name used to perform request
     */
    protected ?string $selectFrom = null;

    /**
     * Max items to return in the list (visible part)
     */
    protected int $maxItems   = 5;

    /**
     * Options used to renders the suggestion dropdown list
     * See: https://wintercms.com/docs/backend/forms#field-dropdown
     *
     * @var array|null
     */
    protected ?array $options    = null;

    /**
     * Pattern to use
     */
    // protected string $pattern    = 'text';


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
            'options',
            'maxItems',
            // 'pattern',
        ]);

        if (!isset($this->table) && !isset($this->modelClass)) {
            $this->modelClass = get_class($this->model);
        } else {
            // Check provided values `table` and `modelClass`
            $this->assertTable();
            $this->assertModelClass();
        };

        // Use the field name as reference
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
        // $this->vars['inputType'] = $this->pattern;
        $this->vars['name']      = $this->formField->getName();
        $this->vars['table']     = $this->table;
        $this->vars['model']     = $this->model;
        $this->vars['value']     = $this->getLoadValue();
        $this->vars['maxItems']  = $this->maxItems;
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
     */
    public function getList(): \Winter\Storm\Support\Collection
    {
        $modelRecords = [];

        if ($this->options && is_array($this->options)) {
            if (Arr::isList($this->options)) {
                Arr::map($this->options, function ($value) use (&$modelRecords) {
                    $modelRecords[$value] = ucfirst($value);
                });

                $modelRecords = collect($modelRecords);
            } else {
                $modelRecords = collect($this->options);
            }

            return $modelRecords;
        }

        
        if ($this->modelClass == 'Winter\Pages\Classes\Page') {
            // TODO : Search inside page fields
            return collect([]);
        }


        if (!$this->modelClass && $this->table) {
            $query = Db::table($this->table);
        } else {
            $model = new $this->modelClass;
            $query = $model->newQuery();
        }

        $modelRecords = $query->select($this->selectFrom)
            ->orderBy($this->selectFrom, 'asc')
            ->distinct()
            ->get()
            ->toArray();

        $modelRecords = collect($modelRecords)->pluck($this->selectFrom, $this->selectFrom);

        return $modelRecords;
    }


    protected function assertTable()
    {
        if (isset($this->table) && !Schema::hasTable($this->table)) {
            throw new \InvalidArgumentException(sprintf("Schema table {%s} not found.", $this->table));
        }
    }

    protected function assertModelClass()
    {
        if (isset($this->modelClass) && !class_exists($this->modelClass)) {
            throw new \InvalidArgumentException(sprintf("Model class {%s} not found.", $this->modelClass));
        }
    }
}
