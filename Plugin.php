<?php namespace Hounddd\SelfComplete;

use Backend;
use System\Classes\PluginBase;

/**
* SelfComplete Plugin Information File
 */
class Plugin extends PluginBase
{
    /**
     * Returns information about this plugin.
     *
     * @return array
     */
    public function pluginDetails()
    {
        return [
            'name'        => 'Self complete',
            'description' => 'Formwidget field populate as a dropdown with column values',
            'author'      => 'Hounddd',
            'icon'        => 'icon-binoculars'
        ];
    }

    /**
     * Register formwidgets
     *
     * @return array
     */
    public function registerFormWidgets()
    {
        return [
            'Hounddd\SelfComplete\FormWidgets\SelfComplete' => 'selfcomplete'
        ];
    }
}
