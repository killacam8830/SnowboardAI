<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInit23c29d09a4cc9a809992661461be1d22
{
    public static $prefixLengthsPsr4 = array (
        'E' => 
        array (
            'Extendify\\' => 10,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'Extendify\\' => 
        array (
            0 => __DIR__ . '/../..' . '/app',
        ),
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInit23c29d09a4cc9a809992661461be1d22::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInit23c29d09a4cc9a809992661461be1d22::$prefixDirsPsr4;

        }, null, ClassLoader::class);
    }
}