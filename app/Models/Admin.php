<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Admin extends Authenticatable
{
    use HasFactory;
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
        'token'
    ];

    protected $hidden = [
        'password',
    ];

    public $timestamps = true;
}
