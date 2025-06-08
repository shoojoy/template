<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Admin extends Model
{
    protected $fillable = [
        'username',
        'password',
        'address',
        'company_name',
        'ceo_name',
        'business_number',
        'phone',
        'fax',
        'email',
        'logo_image_filename',
    ];

    protected $hidden = [
        'password',
    ];

    public $timestamps = true;
}
