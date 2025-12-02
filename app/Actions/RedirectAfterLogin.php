<?php

namespace App\Actions;

use Illuminate\Http\Request;

class RedirectAfterLogin
{
    public function __invoke(Request $request, $user)
    {
        if ($user->role === 'admin') {
            return '/dashboard';
        }

        return '/';
    }
}
