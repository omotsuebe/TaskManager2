<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SharedTask extends Model
{
    protected $table = 'shared_tasks';

    protected $fillable = [
        'task_id',
        'shared_with',
        'shared_by',
    ];

    public function task()
    {
        return $this->belongsTo(Task::class);
    }

    public function sharedWith()
    {
        return $this->belongsTo(User::class, 'shared_with');
    }

    public function sharedBy()
    {
        return $this->belongsTo(User::class, 'shared_by');
    }
}
