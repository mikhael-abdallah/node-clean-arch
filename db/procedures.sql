CREATE PROCEDURE deactivate_discipline
    @id INTEGER = NULL
    AS   
    SET NOCOUNT ON;
    
    INSERT INTO bin_studyloads(discipline_id, school_class_id, creation_date)
   	SELECT discipline_id, school_class_id, creation_date FROM studyloads
   	WHERE discipline_id = @id;
   	
   	DELETE FROM studyloads
   	WHERE discipline_id = @id;
   
   	INSERT INTO bin_discipline(id, name,teacher_id, creation_date)
   	SELECT id, name, teacher_id, creation_date FROM discipline
	WHERE id = @id;

	DELETE FROM discipline
	WHERE id = @id;

    SET NOCOUNT OFF;