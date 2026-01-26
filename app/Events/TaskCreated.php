<?php

namespace App\Events;

use App\Models\Task;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TaskCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public Task $task;
    public array $taskIds;

    public function __construct(Task $task, array $taskIds = [])
    {
        $this->task = $task->loadMissing(['assignee', 'creator', 'column']);
        $this->taskIds = $taskIds;
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('board.' . $this->task->column->board_id),
        ];
    }

    public function broadcastAs(): string
    {
        return 'task.created';
    }

    public function broadcastWith(): array
    {
        return [
            'task' => $this->task->toArray(),
            'task_ids' => $this->taskIds,
        ];
    }
}
